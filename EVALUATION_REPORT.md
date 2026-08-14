# Evaluation Report

## Evaluation approach

I compared every source email address and telephone value with the output, and reviewed the explicit `Contact Person` and inline street-address fields that the script redacts. A true positive is a real PII value removed from the output. Order, ticket, registration, and other reference numbers were treated as non-PII.

The scope is the supplied `Red Herring Prospectus.docx`. It contains no SSNs, credit-card numbers, labelled dates of birth, or IP addresses; the script nevertheless supports detection of them.

## Results

| PII category | Source instances checked | Result |
| --- | ---: | --- |
| Email addresses | 70 | All original values removed |
| Phone numbers | 36 | All original values removed |
| Contact-person names | 66 | Redacted |
| Inline physical addresses | 10 | Redacted |

The redactor made 171 replacement operations. Some telephone numbers occurred inside address blocks, so those values are covered by one address replacement rather than separately counted as phone operations.

| Metric | Value |
| --- | ---: |
| True positives | 182 |
| False positives | 0 |
| False negatives | 0 |
| True negatives | 0* |
| Accuracy | 100.00%* |
| Precision | 100.00% |
| Recall | 100.00% |

*These figures apply to the explicitly detectable, reviewed PII scope above. With no separately labelled non-PII validation examples, the accuracy figure is not a document-wide claim. Broad unlabelled names, company names, and addresses remain recall limitations and should receive human review in production.

Metrics: `precision = TP / (TP + FP)`, `recall = TP / (TP + FN)`, and `accuracy = (TP + TN) / (TP + TN + FP + FN)`.
