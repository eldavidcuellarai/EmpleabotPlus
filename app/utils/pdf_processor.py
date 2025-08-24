import logging

def extract_text_from_pdf(file_path):
    """
    Extract text content from a PDF file. Requires PyPDF2 package.
    """
    try:
        import PyPDF2
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text.strip()
    except ImportError:
        logging.error("PyPDF2 not installed. Unable to process PDF files.")
        return "Error: PyPDF2 not installed. Unable to process PDF files."
    except Exception as e:
        logging.error(f"Error extracting text from PDF: {str(e)}")
        return f"Error extracting text from PDF: {str(e)}"
