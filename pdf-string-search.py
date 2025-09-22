import pytesseract
from pdf2image import convert_from_path
import re
import os

def extract_text_with_ocr(file_path):
    """Extract text using OCR"""
    try:
        pages = convert_from_path(file_path, dpi=200)
        text = ""
        for page in pages:
            text += pytesseract.image_to_string(page)
        return text
    except Exception as e:
        print(f"OCR extraction failed: {e}")
        return ""

def extract_billing_info(line):
    """Extract start date, end date, and billing days from a line"""
    # Pattern to match MM/DD/YYYY dates
    date_pattern = r'(\d{2}/\d{2}/\d{4})'
    # Pattern to match billing days - look for number followed by "billing days"
    billing_days_pattern = r'(\d+)\s+billing\s+days'

    # Find all dates in the line
    dates = re.findall(date_pattern, line)

    # Find billing days
    billing_days_match = re.search(billing_days_pattern, line, re.IGNORECASE)
    billing_days = billing_days_match.group(1) if billing_days_match else None

    # Return first date as start, second as end (if available)
    start_date = dates[0] if len(dates) >= 1 else None
    end_date = dates[1] if len(dates) >= 2 else None

    return start_date, end_date, billing_days

def search_in_text(text, search_term):
    """Search for a term in the extracted text and return matching lines with the line after"""
    if not search_term:
        return text.split('\n')

    lines = text.split('\n')
    matching_results = []

    for i, line in enumerate(lines):
        if search_term.lower() in line.lower():
            # Add the matching line
            matching_results.append((i+1, line, "MATCH"))
            # Add the next line if it exists
            if i + 1 < len(lines):
                matching_results.append((i+2, lines[i+1], "NEXT"))

    return matching_results

def read_pdf(file_path, search_text=""):
    print("Extracting text using OCR...")
    text = extract_text_with_ocr(file_path)

    if text.strip():
        if search_text:
            print(f"\nSearching for '{search_text}'...")
            matching_results = search_in_text(text, search_text)
            if matching_results:
                match_count = len([r for r in matching_results if r[2] == "MATCH"])
                print(f"Found {match_count} matching lines:")
                for line_num, line, line_type in matching_results:
                    if line_type == "MATCH":
                        print(f"Line {line_num} (MATCH): {line}")
                    else:
                        print(f"Line {line_num} (NEXT):  {line}")
                        # Extract dates and billing days from the NEXT line
                        start_date, end_date, total_billing_days = extract_billing_info(line)
                        if start_date and end_date and total_billing_days:
                            print(f"  Start Date: {start_date}")
                            print(f"  End Date: {end_date}")
                            print(f"  Total Billing Days: {total_billing_days}")
            else:
                print(f"No lines found containing '{search_text}'")
        else:
            lines = text.split('\n')
            print(f"\nExtracted {len(lines)} lines of text:")
            for i, line in enumerate(lines):
                if line.strip():  # Only print non-empty lines
                    print(f"Line {i+1}: {line}")
    else:
        print("No text could be extracted from the PDF.")

# Usage
pdf_directory = '/mnt/c/Users/hecto/iCloudDrive/mine/data/pge/'
pdf_filename = '0914.pdf'
file_path = os.path.join(pdf_directory, pdf_filename)
search_text = "Details of PG&E Electric Delivery Charges"
read_pdf(file_path, search_text)
