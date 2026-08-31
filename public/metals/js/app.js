/* Jagetiya Metals — Search, Admin, Stock Manager, Chemical Composition */
(function () {
  var data = window.JKData;
  var storeApi = window.JKStorage;
  var store = window.localStorage;
  var SL = data.SL;
  var custom = storeApi.emptyCustom();
  var DB = data.cloneBuiltin();

  function gp(g, sh, st, sz) { return storeApi.getPrice(store, g, sh, st, sz); }
  function sp(g, sh, st, sz, p) { storeApi.setPrice(store, g, sh, st, sz, p); }
  function gc(g) { return data.gc(g); }
  function uniqSort(a) { return data.uniqSort(a || []); }
  function nearest(a, t, n) { return data.nearest(a || [], t, n); }
  function hasExact(arr, t) { return data.hasExact(arr || [], t); }

  function persist() {
    storeApi.saveCustom(store, custom);
  }

  function bootCatalog() {
    custom = storeApi.loadCustom(store, data.BUILTIN_DB);
    DB = storeApi.applyCustom(data.BUILTIN_DB, custom);
    window.JK_DB = DB;
  }

  function phtml(g, sh, st, sz) {
    var p = gp(g, sh, st, String(sz));
    if (p === null) return '<div class="noprice">No price set for ' + sz + ' mm. Set it in Admin tab.</div>';
    return '<div class="prow"><span class="plbl">PRICE - ' + sz + ' mm</span><span class="pval">Rs ' + p.toFixed(2) + '<small>/kg</small></span></div>';
  }
  function pfhtml(g, sh, st, t, w) {
    var p = gp(g, sh, st, t + "x" + w);
    if (p === null) return "";
    return ' <b style="color:#C8960C;font-size:10px">Rs ' + p.toFixed(2) + '/kg</b>';
  }

  function setSbar(msg, cls) {
    var el = document.getElementById("sbar");
    el.className = "sbar" + (cls ? " " + cls : "");
    el.innerHTML = msg;
  }

  var selShape = null, stimer = null;

  function showIdle() {
    setSbar("Select a shape and enter a size or grade to begin", "");
    document.getElementById("grid").innerHTML =
      '<div class="idlebox"><h3>Smart Stock Search</h3>' +
      '<p>Search by size, grade, or both. Shows live prices on exact matches.</p>' +
      '<div class="isteps">' +
      '<div class="istep"><div class="isn">1</div>Pick shape</div>' +
      '<div class="istep"><div class="isn">2</div>Enter size (mm)</div>' +
      '<div class="istep"><div class="isn">3</div>Add grade (optional)</div>' +
      '<div class="istep"><div class="isn">4</div>See results + prices</div>' +
      '</div></div>';
  }

  function doSearch() {
    var sv = parseFloat(document.getElementById("inSize").value);
    var gv = document.getElementById("inGrade").value.trim().toLowerCase();
    var tv = parseFloat(document.getElementById("inThk").value);
    var wv = parseFloat(document.getElementById("inWid").value);
    var hs = !isNaN(sv) && sv > 0;
    var hg = gv.length > 0;
    var ht = !isNaN(tv) && tv > 0;
    var hw = !isNaN(wv) && wv > 0;
    if (!selShape && !hs && !hg) { showIdle(); return; }
    var shapes = (!selShape || selShape === "All") ? SL : [selShape];
    var cards = [];
    for (var si = 0; si < shapes.length; si++) {
      var sh = shapes[si], ents = DB[sh];
      if (!ents) continue;
      for (var ei = 0; ei < ents.length; ei++) {
        var e = ents[ei];
        if (hg && e.g.toLowerCase().indexOf(gv) === -1) continue;
        if (e.note && !e.sz && !e.flat) { cards.push(cNF(e)); continue; }
        if (sh === "Flat Bar" || e.flat) {
          var fc = cFlat(e, ht ? tv : null, hw ? wv : null, sh);
          if (fc) cards.push(fc);
          continue;
        }
        var bc = cBar(e, sh, hs ? sv : null);
        if (bc) cards.push(bc);
      }
    }
    var grid = document.getElementById("grid");
    if (cards.length === 0) {
      setSbar("No results found. Try different size, grade, or shape.", "none");
      grid.innerHTML = '<div class="idlebox"><h3>No Stock Found</h3><p>No matching stock for these criteria.</p></div>';
      return;
    }
    cards.sort(function (a, b) { var av = a.ex ? 0 : a.nr ? 1 : 2; var bv = b.ex ? 0 : b.nr ? 1 : 2; return av - bv; });
    var ne = 0, nn = 0;
    for (var ci = 0; ci < cards.length; ci++) { if (cards[ci].ex) ne++; else if (cards[ci].nr) nn++; }
    var h = "";
    for (var ci2 = 0; ci2 < cards.length; ci2++) h += cards[ci2].html;
    grid.innerHTML = h;
    bindCards();
    if (ne > 0) setSbar(ne + " exact match" + (ne > 1 ? "es" : "") + " found" + (nn > 0 ? " | " + nn + " with nearest" : ""), "ok");
    else if (nn > 0) setSbar("Exact size not available. Showing nearest.", "warn");
    else setSbar(cards.length + " result" + (cards.length > 1 ? "s" : "") + " found.", "ok");
  }

  function bindCards() {
    var ncs = document.getElementsByClassName("nc");
    for (var i = 0; i < ncs.length; i++) {
      ncs[i].addEventListener("click", function () {
        document.getElementById(this.getAttribute("data-f")).value = this.getAttribute("data-v");
        doSearch();
      });
    }
    var scs = document.getElementsByClassName("sz");
    for (var j = 0; j < scs.length; j++) {
      scs[j].addEventListener("click", function () {
        document.getElementById("inSize").value = this.getAttribute("data-v");
        doSearch();
      });
    }
    var tgs = document.getElementsByClassName("togs");
    for (var k = 0; k < tgs.length; k++) {
      tgs[k].addEventListener("click", function () {
        var box = this.nextSibling;
        while (box && box.nodeType !== 1) box = box.nextSibling;
        if (!box) return;
        if (box.className === "cbox") { box.className = "cbox on"; this.innerHTML = "Hide all sizes"; }
        else { box.className = "cbox"; this.innerHTML = "Show all sizes (" + box.getAttribute("data-c") + ")"; }
      });
    }
  }

  function cBar(e, sh, t) {
    var sz = uniqSort(e.sz || []), col = gc(e.g), mh = "", ex = false, nr = false;
    if (t !== null) {
      if (hasExact(sz, t)) {
        ex = true;
        mh = '<div class="myes"><span class="ml">Exact size available</span><span class="ms">' + t + ' mm</span></div>';
        mh += phtml(e.g, sh, e.s, t);
      } else {
        var nb = nearest(sz, t, 3);
        if (!nb.b.length && !nb.a.length) return null;
        nr = true;
        var chips = "";
        for (var i = 0; i < nb.b.length; i++) chips += '<span class="nc" data-f="inSize" data-v="' + nb.b[i] + '">' + nb.b[i] + ' (below)</span>';
        for (var j = 0; j < nb.a.length; j++) chips += '<span class="nc" data-f="inSize" data-v="' + nb.a[j] + '">' + nb.a[j] + ' (above)</span>';
        mh = '<div class="mno"><span class="ml">Size <b>' + t + ' mm</b> not available in this grade</span></div>' +
          '<div class="mnear"><span class="ml">Nearest available:</span><div class="nr">' + chips + '</div></div>';
      }
    }
    var nb2 = t !== null ? nearest(sz, t, 2) : { b: [], a: [] };
    var ac = "";
    for (var k = 0; k < sz.length; k++) {
      var cls = "sz";
      if (t !== null) { if (sz[k] === t) cls = "sz ex"; else if (nb2.b.indexOf(sz[k]) !== -1 || nb2.a.indexOf(sz[k]) !== -1) cls = "sz nr2"; }
      ac += '<span class="' + cls + '" data-v="' + sz[k] + '">' + sz[k] + '</span>';
    }
    var mk = e.m ? '<span class="tag">' + e.m + '</span>' : "";
    var html = '<div class="card"><div class="ch" style="background:' + col + '18;border-bottom:2px solid ' + col + '44">' +
      '<span class="gbadge" style="background:' + col + '">' + e.g + '</span>' +
      '<div class="meta"><span class="tag sh">' + sh + '</span><span class="tag">' + e.s + '</span>' + mk + '</div></div>' +
      '<div class="cb">' + mh +
      '<span class="togs">Show all sizes (' + sz.length + ')</span>' +
      '<div class="cbox" data-c="' + sz.length + '">' + ac + '</div>' +
      '</div></div>';
    return { html: html, ex: ex, nr: nr };
  }

  function cFlat(e, tv, wv, sh) {
    var fd = e.flat || {}, col = gc(e.g), allT = [], ex = false, nr = false, relT, tn = "";
    for (var k in fd) allT.push(Number(k));
    allT.sort(function (a, b) { return a - b; });
    relT = allT.slice();
    if (tv !== null) {
      if (allT.indexOf(tv) !== -1) { relT = [tv]; }
      else {
        var nt = nearest(allT, tv, 2); relT = nt.b.concat(nt.a); nr = true;
        tn = '<div class="mno"><span class="ml">Thickness <b>' + tv + ' mm</b> not available. Showing nearest.</span></div>';
      }
    }
    var rows = "";
    for (var ri = 0; ri < relT.length; ri++) {
      var t = relT[ri], ws = fd[t] || fd[String(t)] || [], isnT = (tv !== null && t !== tv), wh = "", rc = "";
      if (wv !== null) {
        if (ws.indexOf(wv) !== -1 && !isnT) { ex = true; rc = "rm"; }
        else if (ws.indexOf(wv) === -1) { var nw = nearest(ws, wv, 2); if ((nw.b.length || nw.a.length) && !isnT) { nr = true; rc = "rn"; } }
        for (var wi = 0; wi < ws.length; wi++) {
          var w = ws[wi];
          if (w === wv && !isnT) { var fp = pfhtml(e.g, sh, e.s, t, w); wh += '<span class="we">' + w + fp + '</span> '; }
          else {
            var nw2 = nearest(ws, wv, 2);
            if ((nw2.b.indexOf(w) !== -1 || nw2.a.indexOf(w) !== -1) && !isnT) wh += '<span class="wn">' + w + '</span> ';
            else wh += '<span style="color:#999">' + w + '</span> ';
          }
        }
      } else { wh = ws.join(", "); }
      var tl = isnT ? '<span style="color:#9A7D0A;font-weight:700">' + t + ' (nearest)</span>' : '<b>' + t + '</b>';
      rows += '<tr class="' + rc + '"><td>' + tl + ' mm</td><td>' + wh + '</td></tr>';
    }
    if (!rows) return null;
    var html = '<div class="card"><div class="ch" style="background:' + col + '18;border-bottom:2px solid ' + col + '44">' +
      '<span class="gbadge" style="background:' + col + '">' + e.g + '</span>' +
      '<div class="meta"><span class="tag sh">' + sh + '</span><span class="tag">' + e.s + '</span></div></div>' +
      '<div class="cb">' + tn + '<table class="flt"><thead><tr><th>Thickness (mm)</th><th>Widths Available (mm)</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div>';
    return { html: html, ex: ex, nr: nr };
  }

  function cNF(e) {
    var col = gc(e.g);
    var html = '<div class="card"><div class="ch" style="background:' + col + '18;border-bottom:2px solid ' + col + '44">' +
      '<span class="gbadge" style="background:' + col + '">' + e.g + '</span>' +
      '<div class="meta"><span class="tag sh">Non-Ferrous</span></div></div>' +
      '<div class="cb"><div style="padding:8px 12px;background:#EDE9E0;border-radius:7px;font-size:12px;color:#3A4A5C">' +
      '<b>Available:</b> ' + e.s + '<br><small style="color:#7A8A9A">Contact for specific sizes.</small></div></div></div>';
    return { html: html, ex: false, nr: false };
  }

  function buildPK() {
    var rows = [];
    for (var si = 0; si < SL.length; si++) {
      var sh = SL[si], ents = DB[sh];
      if (!ents) continue;
      for (var ei = 0; ei < ents.length; ei++) {
        var e = ents[ei];
        if (e.note && !e.sz && !e.flat) { rows.push({ g: e.g, sh: sh, st: e.s, sz: "N/A" }); continue; }
        if (e.flat) {
          for (var tk in e.flat) {
            var ws = e.flat[tk];
            for (var wi = 0; wi < ws.length; wi++) rows.push({ g: e.g, sh: sh, st: e.s, sz: tk + "x" + ws[wi] });
          }
        } else if (e.sz) {
          var us = uniqSort(e.sz);
          for (var ui = 0; ui < us.length; ui++) rows.push({ g: e.g, sh: sh, st: e.s, sz: String(us[ui]) });
        }
      }
    }
    return rows;
  }

  var PK = [];

  function renderPT(fv) {
    PK = buildPK();
    var fl = fv ? fv.toLowerCase() : "", h = "", shown = 0;
    for (var i = 0; i < PK.length; i++) {
      var r = PK[i];
      if (fl && r.g.toLowerCase().indexOf(fl) === -1 && r.sh.toLowerCase().indexOf(fl) === -1 && r.st.toLowerCase().indexOf(fl) === -1) continue;
      shown++;
      var col = gc(r.g), p = gp(r.g, r.sh, r.st, r.sz);
      var cur = p !== null ? '<span class="cp">Rs ' + p.toFixed(2) + '</span>' : '<span class="cp na">not set</span>';
      h += '<tr id="ar' + i + '">' +
        '<td><span class="gdot" style="background:' + col + '"></span><b>' + r.g + '</b></td>' +
        '<td><span class="tag sh" style="font-size:9px">' + r.sh + '</span></td>' +
        '<td style="font-size:11px;color:#5A6A7A">' + r.st + '</td>' +
        '<td style="font-family:Courier,monospace;font-size:12px;font-weight:700;color:#1B3A5C">' + r.sz + '</td>' +
        '<td>' + cur + ' <span class="ubdg" id="ub' + i + '">Saved!</span></td>' +
        '<td><div class="piw"><span>Rs</span>' +
        '<input class="pi" type="number" id="pi' + i + '" placeholder="0.00" min="0" step="0.01" value="' + (p !== null ? p : "") + '">' +
        '<span>/kg</span><button class="svbtn" data-i="' + i + '">Save</button></div></td></tr>';
    }
    if (!shown) h = '<tr><td colspan="6" class="norows">No rows match filter.</td></tr>';
    document.getElementById("ptbody").innerHTML = h;
    var svs = document.getElementsByClassName("svbtn");
    for (var b = 0; b < svs.length; b++) {
      svs[b].addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-i"), 10), r2 = PK[idx];
        var val = parseFloat(document.getElementById("pi" + idx).value);
        if (isNaN(val) || val < 0) { alert("Please enter a valid price."); return; }
        sp(r2.g, r2.sh, r2.st, r2.sz, val);
        var tr = document.getElementById("ar" + idx);
        if (tr) tr.className = "upd";
        var ub = document.getElementById("ub" + idx);
        if (ub) ub.className = "ubdg on";
        this.innerHTML = "Saved!"; this.className = "svbtn done";
        var t = this;
        setTimeout(function () { t.innerHTML = "Save"; t.className = "svbtn"; if (tr) tr.className = ""; }, 1800);
      });
    }
  }

  function doExport() {
    var all = buildPK(), csv = "Grade,Shape,Sub-Type,Size (mm),Price (Rs/kg)\n";
    for (var i = 0; i < all.length; i++) {
      var r = all[i], p = gp(r.g, r.sh, r.st, r.sz);
      csv += '"' + r.g + '","' + r.sh + '","' + r.st + '","' + r.sz + '",' + (p !== null ? p.toFixed(2) : "") + "\n";
    }
    var blob = new Blob([csv], { type: "text/csv" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "JKMetal_Prices.csv";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  function parseCSVRow(row) {
    var res = [], cur = "", inQ = false;
    for (var i = 0; i < row.length; i++) {
      var c = row[i];
      if (c === '"') { inQ = !inQ; }
      else if (c === "," && !inQ) { res.push(cur); cur = ""; }
      else { cur += c; }
    }
    res.push(cur); return res;
  }

  function doImport(txt) {
    var lines = txt.split("\n"), cnt = 0;
    for (var i = 1; i < lines.length; i++) {
      var ln = lines[i].trim(); if (!ln) continue;
      var cols = parseCSVRow(ln); if (cols.length < 5) continue;
      var g = cols[0].replace(/^"|"$/g, "").trim();
      var sh = cols[1].replace(/^"|"$/g, "").trim();
      var st = cols[2].replace(/^"|"$/g, "").trim();
      var sz = cols[3].replace(/^"|"$/g, "").trim();
      var pstr = cols[4].replace(/^"|"$/g, "").replace(/[^0-9.]/g, "");
      var p = parseFloat(pstr);
      if (!g || !sh || isNaN(p) || p <= 0) continue;
      sp(g, sh, st, sz, p); cnt++;
    }
    return cnt;
  }

  function showMsg(elId, msg, isOk) {
    var el = document.getElementById(elId);
    el.style.color = isOk ? "#2E8B57" : "#C0392B";
    el.innerHTML = msg;
    setTimeout(function () { el.innerHTML = ""; }, 3000);
  }

  function selectedGrade(selId) {
    var sel = document.getElementById(selId);
    var idx = parseInt(sel.value, 10);
    var list = storeApi.listGrades(DB, SL);
    if (isNaN(idx) || !list[idx]) return null;
    return list[idx];
  }

  function refreshChips() {
    var item = selectedGrade("smGrade2");
    var box = document.getElementById("smSizeChips");
    if (!item) { box.innerHTML = "No grades found."; return; }
    var ent = storeApi.findEntry(DB, item.sh, item.g, item.s);
    if (!ent) { box.innerHTML = "No sizes found."; return; }
    var h = "";
    if (ent.flat) {
      var chips = storeApi.flatChips(ent);
      if (!chips.length) { box.innerHTML = "<span class='hint-muted'>No flat sizes. Add thickness + width above.</span>"; return; }
      for (var i = 0; i < chips.length; i++) {
        var c = chips[i];
        h += '<span class="rem-chip" data-kind="flat" data-sh="' + item.sh + '" data-g="' + encodeURIComponent(item.g) + '" data-s="' + encodeURIComponent(item.s) + '" data-thk="' + c.thk + '" data-wid="' + c.width + '">' + c.label + '</span>';
      }
    } else if (ent.sz && ent.sz.length) {
      var sizes = uniqSort(ent.sz);
      for (var j = 0; j < sizes.length; j++) {
        h += '<span class="rem-chip" data-kind="sz" data-sh="' + item.sh + '" data-g="' + encodeURIComponent(item.g) + '" data-s="' + encodeURIComponent(item.s) + '" data-sz="' + sizes[j] + '">' + sizes[j] + '</span>';
      }
    } else {
      box.innerHTML = "<span class='hint-muted'>Note-only grade (no sizes). Add a size above to start a size list.</span>";
      return;
    }
    box.innerHTML = h;
    var nodes = box.getElementsByClassName("rem-chip");
    for (var t = 0; t < nodes.length; t++) {
      nodes[t].addEventListener("click", function () {
        var sh = this.getAttribute("data-sh");
        var g = decodeURIComponent(this.getAttribute("data-g"));
        var s = decodeURIComponent(this.getAttribute("data-s"));
        var kind = this.getAttribute("data-kind");
        var res;
        if (kind === "flat") {
          res = storeApi.removeFlatSize(DB, custom, sh, g, s, this.getAttribute("data-thk"), this.getAttribute("data-wid"));
        } else {
          res = storeApi.removeSize(DB, custom, sh, g, s, this.getAttribute("data-sz"));
        }
        if (!res.ok) { showMsg("smRemMsg", res.error, false); return; }
        persist();
        showMsg("smRemMsg", "Removed " + (res.label || (res.size + " mm")) + " from " + res.ent.g, true);
        refreshChips();
      });
    }
  }

  function fillSelect(sel, list, keepKey) {
    sel.innerHTML = "";
    var chosen = -1;
    for (var i = 0; i < list.length; i++) {
      var o = document.createElement("option");
      o.value = i;
      o.text = list[i].label;
      sel.appendChild(o);
      var k = list[i].sh + "|" + list[i].g + "|" + list[i].s;
      if (keepKey && k === keepKey) chosen = i;
    }
    if (chosen >= 0) sel.value = String(chosen);
  }

  function gradeKey(item) {
    if (!item) return "";
    return item.sh + "|" + item.g + "|" + item.s;
  }

  function populateSMDropdowns(preferKey) {
    var list = storeApi.listGrades(DB, SL);
    var s1 = document.getElementById("smGrade1");
    var s2 = document.getElementById("smGrade2");
    var s3 = document.getElementById("smGradeRename");
    var keep1 = preferKey || gradeKey(selectedGrade("smGrade1"));
    var keep2 = preferKey || gradeKey(selectedGrade("smGrade2"));
    var keep3 = preferKey || gradeKey(selectedGrade("smGradeRename"));
    fillSelect(s1, list, keep1);
    fillSelect(s2, list, keep2);
    fillSelect(s3, list, keep3);
    updateAddFields();
    refreshChips();
    fillRenameInput();
    return list;
  }

  function fillRenameInput() {
    var item = selectedGrade("smGradeRename");
    var inp = document.getElementById("smRenameTo");
    if (!inp) return;
    inp.value = item ? item.g : "";
  }

  function updateAddFields() {
    var item = selectedGrade("smGrade1");
    var isFlat = item && item.sh === "Flat Bar";
    var isSquare = item && item.sh === "Square Bar";
    document.getElementById("smRoundSizeDiv").style.display = isFlat ? "none" : "flex";
    document.getElementById("smFlatThicknessDiv").style.display = isFlat ? "flex" : "none";
    document.getElementById("smFlatWidthDiv").style.display = isFlat ? "flex" : "none";
    document.getElementById("smSizeLabel").textContent = isSquare ? "SIDE (mm)" : "SIZE (mm)";
    document.getElementById("smAddSize").placeholder = isSquare ? "e.g. 25" : "e.g. 47";
  }

  function updateNgHint() {
    var shape = document.getElementById("ngShape").value;
    var hint = document.getElementById("ngSizesHint");
    var input = document.getElementById("ngSizes");
    if (shape === "Flat Bar") {
      hint.textContent = "THICKNESSxWIDTH PAIRS";
      input.placeholder = "e.g. 6x25,6x32,10x50";
    } else if (shape === "Non-Ferrous") {
      hint.textContent = "SIZES (optional)";
      input.placeholder = "optional, e.g. 12,16,20";
    } else {
      hint.textContent = "SIZES (comma separated)";
      input.placeholder = "e.g. 16,20,25,32,40,50";
    }
  }

  function initStockManager() {
    populateSMDropdowns();
    document.getElementById("smGrade1").addEventListener("change", updateAddFields);
    document.getElementById("smGrade2").addEventListener("change", refreshChips);
    document.getElementById("smGradeRename").addEventListener("change", fillRenameInput);
    document.getElementById("ngShape").addEventListener("change", updateNgHint);
    updateNgHint();

    document.getElementById("btnSmAdd").addEventListener("click", function () {
      var item = selectedGrade("smGrade1");
      if (!item) { showMsg("smAddMsg", "Select a grade first.", false); return; }
      var res;
      if (item.sh === "Flat Bar") {
        var thk = parseFloat(document.getElementById("smAddThickness").value);
        var wid = parseFloat(document.getElementById("smAddWidth").value);
        res = storeApi.addFlatSize(DB, custom, item.sh, item.g, item.s, thk, wid);
        if (!res.ok) { showMsg("smAddMsg", res.error, false); return; }
        persist();
        document.getElementById("smAddThickness").value = "";
        document.getElementById("smAddWidth").value = "";
        showMsg("smAddMsg", "Added " + res.label + " to " + res.ent.g + " successfully!", true);
      } else {
        var szVal = parseFloat(document.getElementById("smAddSize").value);
        res = storeApi.addSize(DB, custom, item.sh, item.g, item.s, szVal);
        if (!res.ok) { showMsg("smAddMsg", res.error, false); return; }
        persist();
        document.getElementById("smAddSize").value = "";
        showMsg("smAddMsg", "Added " + res.size + " mm to " + res.ent.g + " successfully!", true);
      }
      populateSMDropdowns();
    });

    document.getElementById("btnNgAdd").addEventListener("click", function () {
      var res = storeApi.addNewGrade(DB, custom, {
        g: document.getElementById("ngName").value,
        sh: document.getElementById("ngShape").value,
        s: document.getElementById("ngSub").value,
        sizesRaw: document.getElementById("ngSizes").value
      });
      if (!res.ok) { showMsg("ngMsg", res.error, false); return; }
      persist();
      document.getElementById("ngName").value = "";
      document.getElementById("ngSub").value = "";
      document.getElementById("ngSizes").value = "";
      var extra = res.rec.note ? " (note-only)" : (res.rec.flat ? " with flat sizes" : " with " + (res.rec.sz || []).length + " sizes");
      showMsg("ngMsg", "Grade " + res.rec.g + " (" + res.rec.sh + ") added" + extra + "!", true);
      populateSMDropdowns(res.rec.sh + "|" + res.rec.g + "|" + res.rec.s);
    });

    document.getElementById("btnSmRename").addEventListener("click", function () {
      var item = selectedGrade("smGradeRename");
      if (!item) { showMsg("smRenameMsg", "Select a grade first.", false); return; }
      var res = storeApi.renameGrade(DB, custom, store, item.sh, item.g, item.s, document.getElementById("smRenameTo").value);
      if (!res.ok) { showMsg("smRenameMsg", res.error, false); return; }
      persist();
      var extra = res.pricesMoved ? " Moved " + res.pricesMoved + " price(s)." : "";
      if (res.pricesSkipped) extra += " Kept " + res.pricesSkipped + " existing price(s) on the new name.";
      showMsg("smRenameMsg", "Renamed " + res.from + " to " + res.to + "." + extra, true);
      populateSMDropdowns(item.sh + "|" + res.to + "|" + item.s);
      if (document.getElementById("p2").className.indexOf("on") !== -1) {
        renderPT(document.getElementById("af").value.trim());
      }
    });
  }

  var adminUnlocked = false;
  var pinEntry = "";
  var smUnlocked = false;
  var pin2Entry = "";
  var SM_PIN = storeApi.SM_PIN;

  function updateDots() {
    for (var i = 0; i < 4; i++) {
      var d = document.getElementById("pd" + i);
      if (d) d.className = i < pinEntry.length ? "pin-dot filled" : "pin-dot";
    }
  }
  function pinInput(k) {
    if (pinEntry.length >= 4) return;
    pinEntry += k; updateDots();
    document.getElementById("pinErr").innerHTML = "";
    if (pinEntry.length === 4) {
      setTimeout(function () {
        if (pinEntry === storeApi.getPin(store)) {
          adminUnlocked = true;
          document.getElementById("pinOverlay").className = "pin-overlay";
          pinEntry = ""; updateDots();
        } else {
          document.getElementById("pinErr").innerHTML = "Incorrect PIN. Try again.";
          pinEntry = ""; updateDots();
        }
      }, 200);
    }
  }
  function pinDel() {
    if (pinEntry.length > 0) { pinEntry = pinEntry.slice(0, -1); updateDots(); }
    document.getElementById("pinErr").innerHTML = "";
  }
  function showPinOverlay() {
    pinEntry = ""; updateDots();
    document.getElementById("pinErr").innerHTML = "";
    document.getElementById("pinOverlay").className = "pin-overlay show";
  }

  function updateDots2() {
    for (var i = 0; i < 4; i++) {
      var d = document.getElementById("p2d" + i);
      if (d) d.className = i < pin2Entry.length ? "pin-dot filled" : "pin-dot";
    }
  }
  function pin2Input(k) {
    if (pin2Entry.length >= 4) return;
    pin2Entry += k; updateDots2();
    document.getElementById("pin2Err").innerHTML = "";
    if (pin2Entry.length === 4) {
      setTimeout(function () {
        if (pin2Entry === SM_PIN) {
          smUnlocked = true;
          document.getElementById("pin2Overlay").className = "pin-overlay";
          pin2Entry = ""; updateDots2();
        } else {
          document.getElementById("pin2Err").innerHTML = "Incorrect PIN. Try again.";
          pin2Entry = ""; updateDots2();
        }
      }, 200);
    }
  }
  function pin2Del() {
    if (pin2Entry.length > 0) { pin2Entry = pin2Entry.slice(0, -1); updateDots2(); }
    document.getElementById("pin2Err").innerHTML = "";
  }
  function showPin2Overlay() {
    pin2Entry = ""; updateDots2();
    document.getElementById("pin2Err").innerHTML = "";
    document.getElementById("pin2Overlay").className = "pin-overlay show";
  }

  function overlayShown(id) {
    var o = document.getElementById(id);
    return o && o.className.indexOf("show") !== -1;
  }

  function initPins() {
    var keys = document.querySelectorAll("#pinOverlay [data-k]");
    for (var i = 0; i < keys.length; i++) {
      keys[i].addEventListener("click", function () { pinInput(this.getAttribute("data-k")); });
    }
    document.getElementById("pinDel").addEventListener("click", pinDel);
    var keys2 = document.querySelectorAll("#pin2Overlay [data-k2]");
    for (var j = 0; j < keys2.length; j++) {
      keys2[j].addEventListener("click", function () { pin2Input(this.getAttribute("data-k2")); });
    }
    document.getElementById("pin2Del").addEventListener("click", pin2Del);
    document.addEventListener("keydown", function (ev) {
      if (overlayShown("pinOverlay")) {
        if (ev.key >= "0" && ev.key <= "9") pinInput(ev.key);
        else if (ev.key === "Backspace") pinDel();
      } else if (overlayShown("pin2Overlay")) {
        if (ev.key >= "0" && ev.key <= "9") pin2Input(ev.key);
        else if (ev.key === "Backspace") pin2Del();
      }
    });
  }

  var CHEM_COMP = data.CHEM_COMP;
  var chemGrades = Object.keys(CHEM_COMP).sort();
  function renderChemTable(grades) {
    var elem = ["C", "Mn", "Si", "Cr", "Ni", "Mo"];
    var h = '<table style="width:100%;border-collapse:collapse;font-family:Georgia,serif;"><tr style="background:#2E6DA4;color:#fff;">';
    h += '<th style="padding:10px;text-align:left;border:1px solid #ccc;font-size:13px;font-weight:700;">Element</th>';
    for (var g = 0; g < grades.length; g++) h += '<th style="padding:10px;text-align:center;border:1px solid #ccc;font-size:13px;font-weight:700;">' + grades[g] + '</th>';
    h += '</tr>';
    for (var e = 0; e < elem.length; e++) {
      h += '<tr style="background:' + (e % 2 ? "#F7F4EE" : "#fff") + '">';
      h += '<td style="padding:10px;border:1px solid #ccc;font-size:13px;font-weight:600;color:#1B3A5C;">' + elem[e] + '</td>';
      for (var gi = 0; gi < grades.length; gi++) h += '<td style="padding:10px;border:1px solid #ccc;text-align:center;font-size:13px;color:#145A32;">' + CHEM_COMP[grades[gi]][elem[e]] + '%</td>';
      h += '</tr>';
    }
    h += '</table>';
    return h;
  }
  var chemInited = false;
  function initChemComposition() {
    if (chemInited) return;
    chemInited = true;
    var sel = document.getElementById("chemGrade");
    for (var i = 0; i < chemGrades.length; i++) {
      var o = document.createElement("option"); o.value = i; o.text = chemGrades[i]; sel.appendChild(o);
    }
    sel.addEventListener("change", function () {
      document.getElementById("chemIndividual").innerHTML = renderChemTable([chemGrades[parseInt(this.value, 10)]]);
    });
    document.getElementById("chemIndividual").innerHTML = renderChemTable([chemGrades[0]]);
    var cbox = document.getElementById("chemCheckboxes");
    for (var j = 0; j < chemGrades.length; j++) {
      var lbl = document.createElement("label");
      lbl.style.display = "flex"; lbl.style.alignItems = "center"; lbl.style.gap = "8px"; lbl.style.padding = "8px";
      lbl.style.cursor = "pointer"; lbl.style.borderRadius = "6px"; lbl.style.background = "#F7F4EE";
      lbl.style.fontSize = "13px"; lbl.style.fontFamily = "Georgia,serif"; lbl.style.fontWeight = "600"; lbl.style.color = "#1B3A5C";
      var chk = document.createElement("input"); chk.type = "checkbox"; chk.value = j; chk.style.width = "18px"; chk.style.height = "18px"; chk.style.cursor = "pointer";
      var sp = document.createElement("span"); sp.textContent = chemGrades[j];
      lbl.appendChild(chk); lbl.appendChild(sp); cbox.appendChild(lbl);
    }
    document.getElementById("btnShowCompare").addEventListener("click", function () {
      var chks = document.querySelectorAll("#chemCheckboxes input[type='checkbox']");
      var selG = [];
      for (var i = 0; i < chks.length; i++) { if (chks[i].checked) selG.push(chemGrades[parseInt(chks[i].value, 10)]); }
      if (selG.length === 0) { document.getElementById("chemCompare").innerHTML = '<span style="color:#C0392B;font-size:13px;">Select at least 1 grade.</span>'; return; }
      if (selG.length > 3) { document.getElementById("chemCompare").innerHTML = '<span style="color:#C0392B;font-size:13px;">Max 3 grades allowed.</span>'; return; }
      document.getElementById("chemCompare").innerHTML = renderChemTable(selG);
    });
  }

  function showTab(id) {
    var panels = ["p1", "p2", "p3", "p4"];
    var tabs = ["t1", "t2", "t3", "t4"];
    for (var i = 0; i < panels.length; i++) {
      document.getElementById(panels[i]).className = panels[i] === id ? "tp on" : "tp";
    }
    for (var j = 0; j < tabs.length; j++) {
      document.getElementById(tabs[j]).className = tabs[j] === ("t" + id.slice(1)) ? "tbtn on" : "tbtn";
    }
  }

  var smInited = false;

  function openAdmin() {
    showTab("p2");
    renderPT(document.getElementById("af").value.trim());
  }
  function openStock() {
    showTab("p3");
    if (!smInited) { initStockManager(); smInited = true; }
    else { populateSMDropdowns(); }
  }

  function waitUnlock(flagFn, onYes) {
    var poll = setInterval(function () {
      if (flagFn()) { clearInterval(poll); onYes(); }
    }, 200);
  }

  window.addEventListener("DOMContentLoaded", function () {
    bootCatalog();
    showIdle();
    initPins();

    document.getElementById("t1").addEventListener("click", function () { showTab("p1"); });
    document.getElementById("t2").addEventListener("click", function () {
      if (!adminUnlocked) { showPinOverlay(); waitUnlock(function () { return adminUnlocked; }, openAdmin); return; }
      openAdmin();
    });
    document.getElementById("t3").addEventListener("click", function () {
      if (!smUnlocked) { showPin2Overlay(); waitUnlock(function () { return smUnlocked; }, openStock); return; }
      openStock();
    });
    document.getElementById("t4").addEventListener("click", function () {
      showTab("p4");
      initChemComposition();
    });

    var sbs = document.getElementById("shapeRow").getElementsByTagName("button");
    for (var i = 0; i < sbs.length; i++) {
      sbs[i].addEventListener("click", function () {
        var all = document.getElementById("shapeRow").getElementsByTagName("button");
        for (var k = 0; k < all.length; k++) all[k].className = "shbtn";
        this.className = "shbtn on";
        selShape = this.getAttribute("data-shape");
        var isF = (selShape === "Flat Bar");
        document.getElementById("fgSize").style.display = isF ? "none" : "";
        document.getElementById("fgThk").style.display = isF ? "" : "none";
        document.getElementById("fgWid").style.display = isF ? "" : "none";
        doSearch();
      });
    }

    document.getElementById("btnSearch").addEventListener("click", doSearch);
    document.getElementById("btnReset").addEventListener("click", function () {
      selShape = null;
      var all = document.getElementById("shapeRow").getElementsByTagName("button");
      for (var k = 0; k < all.length; k++) all[k].className = "shbtn";
      document.getElementById("inSize").value = "";
      document.getElementById("inGrade").value = "";
      document.getElementById("inThk").value = "";
      document.getElementById("inWid").value = "";
      document.getElementById("fgSize").style.display = "";
      document.getElementById("fgThk").style.display = "none";
      document.getElementById("fgWid").style.display = "none";
      showIdle();
    });

    var ids = ["inSize", "inGrade", "inThk", "inWid"];
    for (var x = 0; x < ids.length; x++) {
      (function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", function () { clearTimeout(stimer); stimer = setTimeout(doSearch, 350); });
        el.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.keyCode === 13) { clearTimeout(stimer); doSearch(); } });
      })(ids[x]);
    }

    document.getElementById("btnAF").addEventListener("click", function () { renderPT(document.getElementById("af").value.trim()); });
    document.getElementById("btnAC").addEventListener("click", function () { document.getElementById("af").value = ""; renderPT(""); });
    document.getElementById("af").addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.keyCode === 13) renderPT(this.value.trim()); });
    document.getElementById("btnExport").addEventListener("click", doExport);
    document.getElementById("btnImport").addEventListener("click", function () { document.getElementById("csvIn").click(); });
    document.getElementById("btnChangePin").addEventListener("click", function () {
      var p1 = document.getElementById("newPin1").value.trim();
      var p2 = document.getElementById("newPin2").value.trim();
      var msg = document.getElementById("pinChgMsg");
      if (p1.length !== 4 || isNaN(Number(p1))) { msg.style.color = "#F5B7B1"; msg.innerHTML = "PIN must be 4 digits."; return; }
      if (p1 !== p2) { msg.style.color = "#F5B7B1"; msg.innerHTML = "PINs do not match."; return; }
      storeApi.savePin(store, p1);
      document.getElementById("newPin1").value = "";
      document.getElementById("newPin2").value = "";
      msg.style.color = "#A8DFC0"; msg.innerHTML = "PIN updated!";
      setTimeout(function () { msg.innerHTML = ""; }, 3000);
    });
    document.getElementById("csvIn").addEventListener("change", function (ev) {
      var file = ev.target.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        var cnt = doImport(e.target.result);
        if (cnt > 0) { alert("Imported " + cnt + " price(s) successfully!"); renderPT(document.getElementById("af").value.trim()); }
        else alert("No valid prices found in CSV.");
        document.getElementById("csvIn").value = "";
      };
      reader.readAsText(file);
    });

    // Deep-link from marketing site: ?shape=&grade=&size= and #p4 chemistry tab
    (function applyQuery() {
      var params;
      try { params = new URLSearchParams(window.location.search || ""); }
      catch (e) { return; }
      var shape = params.get("shape");
      var grade = params.get("grade");
      var size = params.get("size");
      if (shape) {
        var buttons = document.getElementById("shapeRow").getElementsByTagName("button");
        for (var bi = 0; bi < buttons.length; bi++) {
          if (buttons[bi].getAttribute("data-shape") === shape) {
            buttons[bi].click();
            break;
          }
        }
      }
      if (grade) document.getElementById("inGrade").value = grade;
      if (size) document.getElementById("inSize").value = size;
      if (shape || grade || size) doSearch();
      var hash = (window.location.hash || "").replace(/^#/, "");
      if (hash === "p4" || hash === "chem") {
        showTab("p4");
        initChemComposition();
      }
    })();
  });
})();
