"""Vercel serverless endpoint for DOCX PII redaction."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory

from flask import Flask, jsonify, request, send_file

from redact_pii import redact_docx

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 15 * 1024 * 1024  # 15 MB


@app.post("/api/redact")
def redact():
    upload = request.files.get("file")
    if not upload or not upload.filename:
        return jsonify(error="Choose a DOCX file first."), 400
    if not upload.filename.lower().endswith(".docx"):
        return jsonify(error="Only .docx files are supported."), 400

    with TemporaryDirectory() as directory:
        source = Path(directory) / "source.docx"
        output = Path(directory) / "redacted.docx"
        upload.save(source)
        try:
            counts = redact_docx(source, output)
        except Exception:
            return jsonify(error="This file could not be processed. Please upload a valid DOCX document."), 422
        content = BytesIO(output.read_bytes())

    content.seek(0)
    response = send_file(
        content,
        as_attachment=True,
        download_name="redacted_document.docx",
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
    response.headers["X-Redaction-Count"] = str(sum(counts.values()))
    return response
