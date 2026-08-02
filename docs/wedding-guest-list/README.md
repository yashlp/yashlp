# Wedding Functions Guest List

`Wedding_Functions_Guest_List.xlsx` is an editable, Excel Online-compatible
workbook for:

- Mahendi
- Haldi
- Paherwani
- Ganpati Stapna
- Sangeet
- Wedding

The Summary sheet links to every function and shows each function's number of
guest entries and total headcount. Each function sheet has editable guest names,
editable headcounts, notes, filters, and 300 prepared rows. The shared Guest
Directory provides name dropdowns and suggested headcounts across all functions.

The Mahendi sheet and Guest Directory include the 31 entries transcribed from
the supplied screenshot. Their headcount totals 116, matching the screenshot.

## Create the public editable link

The public link must be created from the workbook owner's Microsoft account:

1. Upload `Wedding_Functions_Guest_List.xlsx` to OneDrive.
2. Open it in Excel Online.
3. Select **Share**.
4. Open **Link settings**.
5. Choose **Anyone with the link**.
6. Turn on **Can edit**, then select **Apply**.
7. Copy and send the link to family members.

Everyone using that link sees the same up-to-date workbook. They do not need an
AI account. Depending on the owner's Microsoft 365 policy, Microsoft may ask
editors to sign in or may disable anonymous edit links.

An “Anyone can edit” link can be forwarded and lets recipients change or delete
entries. Keep a backup copy and disable the link after planning is complete.

## Regenerate and verify

Requires Python 3 and `openpyxl` 3.1 or newer:

```bash
python3 create_workbook.py
```

The generator validates the sheet list, links, tables, dropdowns, imported
names, formulas, and the Mahendi total before it exits successfully.
