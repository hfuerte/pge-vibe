package com.pge.vibe.service;

import com.pge.vibe.dto.BillingPeriodInfo;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PdfParsingService {

    private static final Logger logger = LoggerFactory.getLogger(PdfParsingService.class);

    private static final String SEARCH_TEXT = "Details of PG&E Electric Delivery Charges";
    private static final Pattern DATE_PATTERN = Pattern.compile("(\\d{2}/\\d{2}/\\d{4})");
    private static final Pattern BILLING_DAYS_PATTERN = Pattern.compile("(\\d+)\\s+billing\\s+days", Pattern.CASE_INSENSITIVE);

    public BillingPeriodInfo extractBillingPeriod(MultipartFile file) {
        logger.info("Starting PDF text extraction using OCR...");

        try {
            String extractedText = extractTextWithOcr(file);

            if (extractedText == null || extractedText.trim().isEmpty()) {
                return new BillingPeriodInfo(false, "No text could be extracted from the PDF");
            }

            return searchForBillingInfo(extractedText);

        } catch (UnsatisfiedLinkError e) {
            logger.error("Tesseract native library not found. Please ensure Tesseract is installed: ", e);
            return new BillingPeriodInfo(false,
                "PDF OCR functionality unavailable. Please install Tesseract OCR: brew install tesseract");
        } catch (Exception e) {
            logger.error("Error processing PDF: ", e);
            return new BillingPeriodInfo(false, "Error processing PDF: " + e.getMessage());
        }
    }

    private String extractTextWithOcr(MultipartFile file) throws IOException, TesseractException {
        StringBuilder fullText = new StringBuilder();

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            Tesseract tesseract = new Tesseract();

            // Configure Tesseract for macOS with Homebrew installation
            try {
                // Set system properties for Tesseract
                System.setProperty("jna.library.path", "/opt/homebrew/lib:/opt/homebrew/Cellar/tesseract/5.5.1/lib");
                System.setProperty("tessdata.prefix", "/opt/homebrew/Cellar/tesseract/5.5.1/share/tessdata");

                tesseract.setDatapath("/opt/homebrew/Cellar/tesseract/5.5.1/share/tessdata");
                logger.debug("Tesseract configured with data path: /opt/homebrew/Cellar/tesseract/5.5.1/share/tessdata");
            } catch (Exception e) {
                // Fallback to default tessdata location
                logger.warn("Could not set tessdata path, using default: {}", e.getMessage());
            }

            for (int pageIndex = 0; pageIndex < document.getNumberOfPages(); pageIndex++) {
                logger.debug("Processing page {} of {}", pageIndex + 1, document.getNumberOfPages());

                BufferedImage image = pdfRenderer.renderImageWithDPI(pageIndex, 200, ImageType.RGB);
                String pageText = tesseract.doOCR(image);
                fullText.append(pageText).append("\n");
            }
        }

        return fullText.toString();
    }

    private BillingPeriodInfo searchForBillingInfo(String text) {
        String[] lines = text.split("\n");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];

            // Search for lines containing "billing days" (case insensitive)
            if (line.toLowerCase().contains("billing days")) {
                logger.info("Found billing days line at line {}: {}", i + 1, line);

                BillingPeriodInfo result = extractBillingInfo(line);
                if (result.isSuccess()) {
                    return result;
                }
            }
        }

        return new BillingPeriodInfo(false, "Could not find billing period information in PDF");
    }

    private BillingPeriodInfo extractBillingInfo(String line) {
        // Find all dates in the line
        Matcher dateMatcher = DATE_PATTERN.matcher(line);
        String startDate = null;
        String endDate = null;

        if (dateMatcher.find()) {
            startDate = dateMatcher.group(1);
        }
        if (dateMatcher.find()) {
            endDate = dateMatcher.group(1);
        }

        // Find billing days
        Matcher billingDaysMatcher = BILLING_DAYS_PATTERN.matcher(line);
        Integer billingDays = null;
        if (billingDaysMatcher.find()) {
            billingDays = Integer.parseInt(billingDaysMatcher.group(1));
        }

        if (startDate != null && endDate != null && billingDays != null) {
            logger.info("Successfully extracted: Start Date: {}, End Date: {}, Billing Days: {}",
                       startDate, endDate, billingDays);
            return new BillingPeriodInfo(startDate, endDate, billingDays);
        }

        return new BillingPeriodInfo(false, "Could not extract complete billing information from line: " + line);
    }
}