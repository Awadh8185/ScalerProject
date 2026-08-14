# PII Redaction Tool

This Python tool redacts PII in a Word document and writes a new `.docx` file. It uses regular expressions for email addresses, phone numbers, SSNs, IP addresses, card numbers (validated with Luhn), labelled dates of birth and addresses, full names in labelled/contact-person/honorific fields, and company names with legal suffixes (for example, `Limited`, `Pvt. Ltd.`, and `LLP`). Replacements are deterministic synthetic alternatives: the same input value always gets the same replacement in one or more documents.

## Run

Install the only dependency, then run:

```powershell
py -m pip install python-docx
py redact_pii.py "input.docx" "redacted_output.docx"
```

The script preserves paragraphs, tables, headers, and footers. To preserve reliable precision, broad unlabelled proper names/addresses are deliberately not redacted; this is the main recall trade-off. Text inside images, text boxes, comments, and PII split across unusual Word runs is not detected. A production version would add OCR and named-entity recognition (for example, Microsoft Presidio/spaCy) plus human review of flagged items.

## Evaluation

Create a labelled CSV containing `actual,predicted`, where `1` means PII/redacted and `0` means non-PII/not redacted. Run `py redact_pii.py --evaluate evaluation_labels.csv`. See `EVALUATION_REPORT.md` for metric definitions and the reporting template.

## Deploy the web app to Vercel

The project includes a browser interface in `public/` and a Vercel Python endpoint in `api/redact.py`. Push this folder to a GitHub repository, then in Vercel select **Add New → Project → Import** that repository and select **Deploy**. Vercel installs `requirements.txt`, serves the page from `public/`, and exposes the endpoint at `/api/redact`. Do not upload the unredacted prospectus to the repository; users upload documents directly in the deployed interface.
