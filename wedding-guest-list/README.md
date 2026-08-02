# Wedding Guest List

Shared guest list for **Mehndi, Haldi, Paherwani, Ganpati Stapna, Sangeet, and Wedding**.

Your existing Mehndi guests (31 parties / **116 people**) are already loaded.

---

## Two ways to use this (both shareable with family)

### 1) Notion link (live — recommended for phones)

Open and share this page:

**https://app.notion.com/p/3b0b66dd3a528157bba5faacea45936b**

**Make it editable for everyone:**

1. Open the link above (on phone or computer).
2. Tap **Share** (top right).
3. Set access to **Can edit** (or invite family by WhatsApp/email).
4. Copy the link and send it on WhatsApp.

Family members do **not** need Cursor/Claude. They only need the Notion link (free Notion account if prompted). Everyone sees updates in real time. Guest names and family-member counts are fully editable. When adding a guest, select every event they will attend.

Event sections on the page: Mehndi · Haldi · Paherwani · Ganpati Stapna · Sangeet · Wedding.

---

### 2) Excel / Google Sheets file

File: [`Wedding_Guest_List.xlsx`](./Wedding_Guest_List.xlsx)

Sheets included:

| Sheet | Purpose |
| --- | --- |
| **Summary** | Click an event name to jump to that sheet; shows party count + total people |
| **Master** | One row per guest; mark **Yes/No** for each event (best for multi-event guests) |
| **Mehndi / Haldi / Paherwani / Ganpati Stapna / Sangeet / Wedding** | Per-event view + totals on the side |
| **How to Share** | Step-by-step sharing guide |

#### Share via Google Sheets (anyone with the link can edit)

1. Go to [Google Drive](https://drive.google.com) and sign in.
2. Upload `Wedding_Guest_List.xlsx`.
3. Right-click → **Open with → Google Sheets**.
4. Click **Share** → General access → **Anyone with the link** → **Editor**.
5. Copy the link and send it to family on WhatsApp.

Everyone can keep adding and editing; the list stays updated for all.

#### How to add a guest to multiple events (Excel / Sheets)

1. Open the **Master** sheet.
2. Add **Guest Name** and **Family Members**.
3. Set **Yes** under every event they attend.
4. Summary and event sheets update from Master.

---

## Mehndi pre-loaded data

Imported from your existing sheet. Total people: **116**.

---

## Regenerating the Excel file

```bash
python3 wedding-guest-list/create_guest_list.py
```
