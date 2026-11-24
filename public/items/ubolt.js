/* ----- U-BOLT / U-CLAMP MODULE ----- */
window.QS_MODULES.push({
  id: "ubolt",
  name: "U bolt / U clamp",
  searchWords: [
    "U-BOLT",
    "U BOLT",
    "U-CLAMP",
    "U CLAMP"
  ],
  searchRegexPatterns: [
    /(^|[^a-z0-9])pipe[\s,]*od\b[\s\S]*?\bu[\s-]*clamp($|[^a-z0-9])/i
  ],
  notAScrewWords: [
    "WIRE ROPE CLAMP",
    "WIRE ROPE",
    "ROPE CLAMP"
  ],
  tileBg: "#D8F5EA",
  tileColor: "#0D3A2F",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M7 18V10a5 5 0 0 1 10 0v8"></path>' +
      '<path d="M5.5 15h3"></path>' +
      '<path d="M5.5 17.5h3"></path>' +
      '<path d="M15.5 15h3"></path>' +
      '<path d="M15.5 17.5h3"></path>' +
    '</svg>',

  /* SAP export defaults for U bolt / U clamp */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit U bolt / U clamp dropdown lists */
  lists: {
    kind: ["U-BOLT", "U-CLAMP"],
    material: ["MS", "CS", "SS", "GI"],
    uBoltType: [
      { code: "RND", label: "RND (round bend)" },
      { code: "SQ", label: "SQ (square bend)" },
      { code: "HANGER", label: "HANGER (hanger U-bolt)" }
    ],
    uClampType: [
      { code: "RND", label: "RND (round bend)" },
      { code: "SQ", label: "SQ (square bend)" },
      { code: "LINED", label: "LINED (rubber / polymer sleeve)" },
      { code: "FLAT", label: "FLAT (flat strap with mounting ears)" },
      { code: "HANGER", label: "HANGER" }
    ],
    inchSize: ["1/2", "3/4", "1", "1.1/4", "1.1/2", "2", "2.1/2", "3", "4", "5", "6", "8", "10", "12"],
    mmSize: ["20", "25", "32", "40", "50", "60", "75", "90", "110", "114", "140", "168"],
    threadSize: ["M6", "M8", "M10", "M12", "M16"],
    threadType: ["BSPP", "BSPT", "NPT"],
    threadLength: [
      { code: "FULL THD", label: "Full thread" },
      { code: "HALF THD", label: "Half thread" },
      { code: "QTR THD", label: "Quarter thread" }
    ],
    finish: [
      { code: "HDG", label: "HDG (hot-dip galvanized)" },
      { code: "ZP", label: "ZP (zinc-plated)" }
    ]
  },

  /* Easy-to-edit material colors for the drawing */
  materialColors: {
    "MS": { fill: "#6B7280", shade: "#4B5563", stroke: "#1F2937", detail: "#374151", dot: "#5B6472", shine: false },
    "CS": { fill: "#525C68", shade: "#363F4A", stroke: "#111827", detail: "#1F2937", dot: "#414A54", shine: false },
    "SS": { fill: "#E8EEF4", shade: "#CBD5E1", stroke: "#475569", detail: "#64748B", dot: "#DCE5EE", shine: true },
    "GI": { fill: "#F1F5F9", shade: "#DCE4EC", stroke: "#64748B", detail: "#94A3B8", dot: "#E5ECF3", shine: false }
  },

  /* Easy-to-edit plain-word meanings for Long text */
  meanings: {
    material: {
      "MS": "Mild steel",
      "CS": "Carbon steel",
      "SS": "Stainless steel",
      "GI": "Galvanized iron"
    },
    type: {
      "RND": "round bend",
      "SQ": "square bend",
      "HANGER": "hanger",
      "LINED": "lined with rubber",
      "FLAT": "flat strap"
    },
    threadLength: {
      "FULL THD": "full thread",
      "HALF THD": "half thread",
      "QTR THD": "quarter thread"
    },
    finish: {
      "HDG": "hot-dip galvanized",
      "ZP": "zinc-plated"
    }
  },

  /* Build SAP Short Text (max 40 chars, never auto-cut) */
  buildShortText: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const normalizeMaterial = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (raw === "STEEL" || raw === "MILD STEEL") return "MS";
      if (raw === "GALVANIZED" || raw === "GALVANISED" || raw === "GALVANIZED IRON") return "GI";
      if (raw === "CARBON STEEL") return "CS";
      if (raw === "STAINLESS STEEL") return "SS";
      return raw;
    };
    const resolveChoiceUpper = function (choice, otherVal) {
      return choice === "__OTHER__" ? upper(otherVal) : upper(choice);
    };
    const formatUBoltPipeSize = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? clean(otherVal) : clean(choice);
      if (!raw) return "";
      const u = raw.replace(/^OD\s*/i, "").trim().toUpperCase();
      if (!u) return "";
      return /"$/.test(u) ? u : (u + '"');
    };
    const formatUClampPipeSize = function (unitVal, inchChoice, inchOther, mmChoice, mmOther) {
      const unit = clean(unitVal) === "mm" ? "mm" : "Inch";
      if (unit === "mm") {
        const raw = mmChoice === "__OTHER__" ? upper(mmOther) : upper(mmChoice);
        if (!raw) return "";
        let core = raw.replace(/^OD\s*/i, "").trim();
        if (!core) return "";
        if (/"$/.test(core)) return "OD" + core;
        core = core.replace(/\s*MM$/, "").trim();
        return core ? ("OD" + core + "MM") : "";
      }
      const raw = inchChoice === "__OTHER__" ? upper(inchOther) : upper(inchChoice);
      if (!raw) return "";
      const core = raw.replace(/^OD\s*/i, "").trim();
      if (!core) return "";
      if (/MM$/.test(core)) return "OD" + core.replace(/\s+/g, "");
      const cleanInch = core.replace(/"/g, "").trim();
      return cleanInch ? ("OD" + cleanInch + '"') : "";
    };

    const kind = upper(values.kind);
    const material = normalizeMaterial(values.material, values.materialOther);
    const finish = resolveChoiceUpper(values.finish, values.finishOther);

    if (kind === "U-CLAMP") {
      const clampType = resolveChoiceUpper(values.clampType, values.clampTypeOther);
      const pipeSize = formatUClampPipeSize(
        values.clampSizeUnit,
        values.clampInchSize,
        values.clampInchSizeOther,
        values.clampMmSize,
        values.clampMmSizeOther
      );
      const holeOrThread = resolveChoiceUpper(values.clampThreadOrHole, values.clampThreadOrHoleOther);

      const hasAnyField = Boolean(
        kind || material || clampType || pipeSize || holeOrThread || finish
      );
      if (!hasAnyField) {
        return "";
      }

      return [
        material || "?",
        "U-CLAMP",
        clampType || "?",
        pipeSize || "?",
        holeOrThread,
        finish
      ].filter(Boolean).join(" ");
    }

    const boltType = resolveChoiceUpper(values.boltType, values.boltTypeOther);
    const boltPipeSize = formatUBoltPipeSize(values.boltPipeSize, values.boltPipeSizeOther);
    const legRaw = upper(values.legLength).replace(/^L\s*=?\s*/, "").replace(/\s*MM$/, "").trim();
    const legPart = legRaw ? ("L" + legRaw) : "?";
    const threadSize = resolveChoiceUpper(values.threadSize, values.threadSizeOther);
    const threadType = resolveChoiceUpper(values.threadType, values.threadTypeOther);

    const hasAnyField = Boolean(
      kind || material || boltType || boltPipeSize || legRaw || threadSize || threadType || finish || values.threadLength
    );
    if (!hasAnyField) {
      return "";
    }

    return [
      material || "?",
      kind || "?",
      boltType || "?",
      boltPipeSize || "?",
      legPart,
      threadSize || "?",
      threadType || "?",
      finish
    ].filter(Boolean).join(" ");
  },

  /* Build plain-word Long Text from current values and meanings */
  buildLongText: function (values) {
    const mod = this;
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const normalizeMaterial = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? clean(otherVal) : clean(choice);
      if (!raw) return "";
      const u = raw.toUpperCase();
      if (u === "STEEL" || u === "MILD STEEL") return "MS";
      if (u === "GALVANIZED" || u === "GALVANISED" || u === "GALVANIZED IRON") return "GI";
      if (u === "CARBON STEEL") return "CS";
      if (u === "STAINLESS STEEL") return "SS";
      return raw;
    };
    const resolveChoiceClean = function (choice, otherVal) {
      return choice === "__OTHER__" ? clean(otherVal) : clean(choice);
    };

    const kind = upper(values.kind);
    const matRaw = normalizeMaterial(values.material, values.materialOther);
    const matCode = upper(matRaw);
    const finishRaw = resolveChoiceClean(values.finish, values.finishOther);
    const finishCode = upper(finishRaw);
    const finishWord = finishCode
      ? (mod.meanings.finish[finishCode] || finishRaw.toLowerCase()) + " finish"
      : "";

    const matWord = matCode ? (mod.meanings.material[matCode] || matRaw) : "Not specified";
    const matLead = matWord + " material";

    if (kind === "U-CLAMP") {
      const typeRaw = resolveChoiceClean(values.clampType, values.clampTypeOther);
      const typeCode = upper(typeRaw);
      const typeWord = typeCode ? (mod.meanings.type[typeCode] || typeRaw.toLowerCase()) : "";
      const lead = [matLead, typeWord, "U-clamp"].filter(Boolean).join(" ");

      const unit = clean(values.clampSizeUnit) === "mm" ? "mm" : "Inch";
      let pipeSizePhrase = "";
      if (unit === "mm") {
        const mmRaw = resolveChoiceClean(values.clampMmSize, values.clampMmSizeOther)
          .replace(/^OD\s*/i, "")
          .replace(/\s*mm$/i, "")
          .trim();
        if (mmRaw) {
          pipeSizePhrase = /"$/.test(mmRaw)
            ? ("pipe outer diameter = " + mmRaw.replace(/"/g, "") + " inch")
            : ("pipe outer diameter = " + mmRaw + " mm");
        }
      } else {
        const inchRaw = resolveChoiceClean(values.clampInchSize, values.clampInchSizeOther)
          .replace(/^OD\s*/i, "")
          .trim();
        if (inchRaw) {
          if (/mm$/i.test(inchRaw)) {
            pipeSizePhrase = "pipe outer diameter = " + inchRaw.replace(/\s*mm$/i, "") + " mm";
          } else {
            pipeSizePhrase = "pipe outer diameter = " + inchRaw.replace(/"/g, "") + " inch";
          }
        }
      }

      const holeOrThread = resolveChoiceClean(values.clampThreadOrHole, values.clampThreadOrHoleOther);
      const hasAnyField = Boolean(kind || matRaw || typeRaw || pipeSizePhrase || holeOrThread || finishRaw);
      if (!hasAnyField) {
        return "";
      }

      const specs = [];
      if (pipeSizePhrase) specs.push(pipeSizePhrase);
      if (holeOrThread) {
        const uHole = holeOrThread.toUpperCase();
        if (/HOLE/i.test(uHole)) {
          specs.push("mounting hole " + holeOrThread.replace(/\s*hole/i, "").trim());
        } else if (/^M\d+/i.test(uHole)) {
          specs.push("mounting thread " + uHole);
        } else {
          specs.push("mounting size " + holeOrThread);
        }
      }
      if (finishWord) specs.push(finishWord);

      return specs.length > 0 ? (lead + " with " + specs.join(", ")) : lead;
    }

    const typeRaw = resolveChoiceClean(values.boltType, values.boltTypeOther);
    const typeCode = upper(typeRaw);
    const typeWord = typeCode ? (mod.meanings.type[typeCode] || typeRaw.toLowerCase()) : "";
    const kindWord = kind === "U-BOLT" ? "U-bolt" : "U-bolt / U-clamp";
    const lead = [matLead, typeWord, kindWord].filter(Boolean).join(" ");

    const pipeInch = resolveChoiceClean(values.boltPipeSize, values.boltPipeSizeOther)
      .replace(/^OD\s*/i, "")
      .replace(/"/g, "")
      .trim();
    const legRaw = clean(values.legLength).replace(/^L\s*=?\s*/i, "").replace(/\s*mm$/i, "").trim();
    const threadSize = resolveChoiceClean(values.threadSize, values.threadSizeOther);
    const threadType = resolveChoiceClean(values.threadType, values.threadTypeOther);
    const threadLengthCode = upper(values.threadLength);
    const threadLengthWord = threadLengthCode
      ? (mod.meanings.threadLength[threadLengthCode] || threadLengthCode.toLowerCase())
      : "";

    const hasAnyField = Boolean(
      kind || matRaw || typeRaw || pipeInch || legRaw || threadSize || threadType || threadLengthCode || finishRaw
    );
    if (!hasAnyField) {
      return "";
    }

    const specs = [];
    if (pipeInch) specs.push("pipe size = " + pipeInch + " inch");
    if (legRaw) specs.push("leg length " + legRaw + " mm");
    if (threadSize) specs.push("thread size " + upper(threadSize));
    if (threadType) specs.push("thread type " + upper(threadType));
    if (threadLengthWord) specs.push(threadLengthWord);
    if (finishWord) specs.push(finishWord);

    return specs.length > 0 ? (lead + " with " + specs.join(", ")) : lead;
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const resolveChoice = function (choice, otherVal) {
      if (choice === "__OTHER__") return clean(otherVal);
      return clean(choice);
    };

    const missing = [];
    const kind = clean(values.kind).toUpperCase();
    if (!kind) missing.push("Kind");
    if (!resolveChoice(values.material, values.materialOther)) missing.push("Material");

    if (kind === "U-CLAMP") {
      if (!resolveChoice(values.clampType, values.clampTypeOther)) missing.push("Type");
      const unit = clean(values.clampSizeUnit) === "mm" ? "mm" : "Inch";
      const hasSize = unit === "mm"
        ? Boolean(resolveChoice(values.clampMmSize, values.clampMmSizeOther))
        : Boolean(resolveChoice(values.clampInchSize, values.clampInchSizeOther));
      if (!hasSize) missing.push("Pipe size");
      return missing;
    }

    if (!resolveChoice(values.boltType, values.boltTypeOther)) missing.push("Type");
    if (!resolveChoice(values.boltPipeSize, values.boltPipeSizeOther)) missing.push("Pipe size");
    if (!clean(values.legLength)) missing.push("Leg length");
    if (!resolveChoice(values.threadSize, values.threadSizeOther)) missing.push("Thread size");
    if (!resolveChoice(values.threadType, values.threadTypeOther)) missing.push("Thread type");
    return missing;
  },

  /* Build crisp SVG drawing for U-bolt (RND, SQ, HANGER) or U-clamp (RND, SQ, LINED, FLAT, HANGER) */
  buildDrawingSvg: function (values, shortNameText) {
    const mod = this;
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const esc = function (s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    };
    const wrapLines = function (text, maxChars) {
      const str = clean(text);
      if (!str) return [];
      const words = str.split(" ");
      const lines = [];
      let current = "";
      words.forEach(function (w) {
        if (w.length > maxChars) {
          if (current) {
            lines.push(current);
            current = "";
          }
          for (let i = 0; i < w.length; i += maxChars) {
            lines.push(w.slice(i, i + maxChars));
          }
        } else if (!current) {
          current = w;
        } else if ((current + " " + w).length <= maxChars) {
          current += " " + w;
        } else {
          lines.push(current);
          current = w;
        }
      });
      if (current) lines.push(current);
      return lines;
    };
    const normalizeMaterial = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (raw === "STEEL" || raw === "MILD STEEL") return "MS";
      if (raw === "GALVANIZED" || raw === "GALVANISED" || raw === "GALVANIZED IRON") return "GI";
      if (raw === "CARBON STEEL") return "CS";
      if (raw === "STAINLESS STEEL") return "SS";
      return raw;
    };
    const resolveChoiceUpper = function (choice, otherVal) {
      return choice === "__OTHER__" ? upper(otherVal) : upper(choice);
    };

    const kind = upper(values.kind);
    const isClamp = kind === "U-CLAMP";
    const material = normalizeMaterial(values.material, values.materialOther);
    const finish = resolveChoiceUpper(values.finish, values.finishOther);

    const hasMat = Boolean(material);
    const matPalette = (material && mod.materialColors && mod.materialColors[material]) ? mod.materialColors[material] : null;
    const useShine = Boolean(matPalette && matPalette.shine);
    const fillColor = matPalette
      ? (useShine ? "url(#ubolt-ss-grad)" : matPalette.fill)
      : (hasMat ? "#D5DCE3" : "#EEF2F6");
    const shadeColor = matPalette ? matPalette.shade : (hasMat ? "#BCC7D2" : "#E2E8F0");
    const strokeColor = matPalette ? matPalette.stroke : (hasMat ? "#475569" : "#94A3B8");
    const detailColor = matPalette ? matPalette.detail : (hasMat ? "#64748B" : "#94A3B8");
    const dotColor = matPalette ? matPalette.dot : (hasMat ? "#D5DCE3" : "#EEF2F6");

    const defsSvg = useShine
      ? '<defs><linearGradient id="ubolt-ss-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#F8FAFC" />' +
          '<stop offset="35%" stop-color="#FFFFFF" />' +
          '<stop offset="70%" stop-color="#CBD5E1" />' +
          '<stop offset="100%" stop-color="#F1F5F9" />' +
        '</linearGradient></defs>'
      : "";

    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW U BOLT / U CLAMP"];
    const topIsPlaceholder = !topText;
    const topShift = Math.max(0, topLines.length - 1) * 15;

    const topSvg = topLines.map(function (line, i) {
      const y = 22 + i * 15;
      const color = topIsPlaceholder ? "#94A3B8" : "#10302A";
      return (
        '<text x="190" y="' + y + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + color + '">' +
          esc(line) +
        '</text>'
      );
    }).join("");

    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";
    const cx = 190;

    let shapeSvg = "";
    let infoStartY = 235 + topShift;
    let specLines = [];

    if (isClamp) {
      const clampType = resolveChoiceUpper(values.clampType, values.clampTypeOther);
      const unit = clean(values.clampSizeUnit) === "mm" ? "mm" : "Inch";
      let pipeDisp = "";
      if (unit === "mm") {
        const r = resolveChoiceUpper(values.clampMmSize, values.clampMmSizeOther).replace(/^OD\s*/i, "").replace(/\s*MM$/, "").trim();
        if (r) pipeDisp = "OD" + r + "MM";
      } else {
        const r = resolveChoiceUpper(values.clampInchSize, values.clampInchSizeOther).replace(/^OD\s*/i, "").replace(/"/g, "").trim();
        if (r) pipeDisp = "OD" + r + '"';
      }
      const holeOrThread = resolveChoiceUpper(values.clampThreadOrHole, values.clampThreadOrHoleOther);

      const archY = 122 + topShift;
      const outerR = 46;
      const strapW = clampType === "FLAT" ? 16 : 12;
      const innerR = outerR - strapW;
      const legBottom = archY + 38;
      const earLen = 34;

      /* Dashed pipe reference circle inside clamp */
      const pipeRefSvg =
        '<circle cx="' + cx + '" cy="' + archY + '" r="' + (innerR - 4) + '" fill="none" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4 3" />' +
        '<text x="' + cx + '" y="' + (archY + 4) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (pipeDisp ? reqColor : missingColor) + '">' +
          esc(pipeDisp || "OD ?") +
        '</text>';

      if (clampType === "SQ") {
        const outerLeft = cx - outerR;
        const outerRight = cx + outerR;
        const innerLeft = cx - innerR;
        const innerRight = cx + innerR;
        const topY = archY - outerR;
        const innerTopY = archY - innerR;
        const path =
          "M " + (outerLeft - earLen) + " " + legBottom +
          " L " + outerLeft + " " + legBottom +
          " L " + outerLeft + " " + topY +
          " L " + outerRight + " " + topY +
          " L " + outerRight + " " + legBottom +
          " L " + (outerRight + earLen) + " " + legBottom +
          " L " + (outerRight + earLen) + " " + (legBottom - strapW) +
          " L " + innerRight + " " + (legBottom - strapW) +
          " L " + innerRight + " " + innerTopY +
          " L " + innerLeft + " " + innerTopY +
          " L " + innerLeft + " " + (legBottom - strapW) +
          " L " + (outerLeft - earLen) + " " + (legBottom - strapW) + " Z";
        shapeSvg =
          pipeRefSvg +
          '<path d="' + path + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="round" />' +
          '<circle cx="' + (outerLeft - earLen / 2) + '" cy="' + (legBottom - strapW / 2) + '" r="3.5" fill="#FFFFFF" stroke="' + strokeColor + '" stroke-width="1" />' +
          '<circle cx="' + (outerRight + earLen / 2) + '" cy="' + (legBottom - strapW / 2) + '" r="3.5" fill="#FFFFFF" stroke="' + strokeColor + '" stroke-width="1" />';
      } else {
        const outerLeft = cx - outerR;
        const outerRight = cx + outerR;
        const innerLeft = cx - innerR;
        const innerRight = cx + innerR;
        const path =
          "M " + (outerLeft - earLen) + " " + legBottom +
          " L " + outerLeft + " " + legBottom +
          " L " + outerLeft + " " + archY +
          " A " + outerR + " " + outerR + " 0 0 1 " + outerRight + " " + archY +
          " L " + outerRight + " " + legBottom +
          " L " + (outerRight + earLen) + " " + legBottom +
          " L " + (outerRight + earLen) + " " + (legBottom - strapW) +
          " L " + innerRight + " " + (legBottom - strapW) +
          " L " + innerRight + " " + archY +
          " A " + innerR + " " + innerR + " 0 0 0 " + innerLeft + " " + archY +
          " L " + innerLeft + " " + (legBottom - strapW) +
          " L " + (outerLeft - earLen) + " " + (legBottom - strapW) + " Z";

        let extraSvg = "";
        if (clampType === "LINED") {
          const linerR = innerR - 4;
          const linerPath =
            "M " + innerLeft + " " + (archY + 18) +
            " L " + innerLeft + " " + archY +
            " A " + innerR + " " + innerR + " 0 0 1 " + innerRight + " " + archY +
            " L " + innerRight + " " + (archY + 18) +
            " L " + (cx + linerR) + " " + (archY + 18) +
            " L " + (cx + linerR) + " " + archY +
            " A " + linerR + " " + linerR + " 0 0 0 " + (cx - linerR) + " " + archY +
            " L " + (cx - linerR) + " " + (archY + 18) + " Z";
          extraSvg = '<path d="' + linerPath + '" fill="#1F2937" stroke="#0F172A" stroke-width="1" />';
        } else if (clampType === "HANGER") {
          extraSvg =
            '<rect x="' + (cx - 12) + '" y="' + (archY - outerR - 18) + '" width="24" height="18" rx="2" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.1" />' +
            '<circle cx="' + cx + '" cy="' + (archY - outerR - 9) + '" r="3.5" fill="#FFFFFF" stroke="' + strokeColor + '" stroke-width="1" />';
        } else if (clampType === "FLAT") {
          extraSvg =
            '<line x1="' + (outerLeft + 4) + '" y1="' + (archY - 10) + '" x2="' + (outerLeft + 4) + '" y2="' + (legBottom - strapW - 2) + '" stroke="' + detailColor + '" stroke-width="0.9" stroke-dasharray="3 2" />' +
            '<line x1="' + (outerRight - 4) + '" y1="' + (archY - 10) + '" x2="' + (outerRight - 4) + '" y2="' + (legBottom - strapW - 2) + '" stroke="' + detailColor + '" stroke-width="0.9" stroke-dasharray="3 2" />';
        }

        shapeSvg =
          pipeRefSvg +
          '<path d="' + path + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="round" />' +
          extraSvg +
          '<circle cx="' + (outerLeft - earLen / 2) + '" cy="' + (legBottom - strapW / 2) + '" r="3.5" fill="#FFFFFF" stroke="' + strokeColor + '" stroke-width="1" />' +
          '<circle cx="' + (outerRight + earLen / 2) + '" cy="' + (legBottom - strapW / 2) + '" r="3.5" fill="#FFFFFF" stroke="' + strokeColor + '" stroke-width="1" />';
      }

      infoStartY = legBottom + 32;
      const specs = ["Kind: U-CLAMP", "Type: " + (clampType || "?")];
      if (holeOrThread) specs.push("Thread/Hole: " + holeOrThread);
      if (finish) specs.push("Finish: " + finish);
      specLines = wrapLines(specs.join("  |  "), 46);
    } else {
      const boltType = resolveChoiceUpper(values.boltType, values.boltTypeOther);
      const boltPipeSize = resolveChoiceUpper(values.boltPipeSize, values.boltPipeSizeOther).replace(/^OD\s*/i, "").replace(/"/g, "").trim();
      const pipeDisp = boltPipeSize ? (boltPipeSize + '"') : "?";
      const legRaw = upper(values.legLength).replace(/^L\s*=?\s*/, "").replace(/\s*MM$/, "").trim();
      const threadSize = resolveChoiceUpper(values.threadSize, values.threadSizeOther);
      const threadType = resolveChoiceUpper(values.threadType, values.threadTypeOther);

      const archY = 108 + topShift;
      const midR = 36;
      const barThick = 11;
      const halfT = barThick / 2;
      const outerR = midR + halfT;
      const innerR = midR - halfT;
      const legBottom = archY + 78;
      const threadTop = legBottom - 34;

      /* Pipe reference circle inside U-bolt */
      const pipeRefSvg =
        '<circle cx="' + cx + '" cy="' + archY + '" r="' + (innerR - 4) + '" fill="none" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4 3" />' +
        '<text x="' + cx + '" y="' + (archY + 4) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (boltPipeSize ? reqColor : missingColor) + '">' +
          esc(pipeDisp) +
        '</text>';

      let bodyPath = "";
      if (boltType === "SQ") {
        const oL = cx - outerR;
        const oR = cx + outerR;
        const iL = cx - innerR;
        const iR = cx + innerR;
        const oTop = archY - outerR;
        const iTop = archY - innerR;
        bodyPath =
          "M " + oL + " " + legBottom +
          " L " + oL + " " + oTop +
          " L " + oR + " " + oTop +
          " L " + oR + " " + legBottom +
          " L " + iR + " " + legBottom +
          " L " + iR + " " + iTop +
          " L " + iL + " " + iTop +
          " L " + iL + " " + legBottom + " Z";
      } else {
        const oL = cx - outerR;
        const oR = cx + outerR;
        const iL = cx - innerR;
        const iR = cx + innerR;
        bodyPath =
          "M " + oL + " " + legBottom +
          " L " + oL + " " + archY +
          " A " + outerR + " " + outerR + " 0 0 1 " + oR + " " + archY +
          " L " + oR + " " + legBottom +
          " L " + iR + " " + legBottom +
          " L " + iR + " " + archY +
          " A " + innerR + " " + innerR + " 0 0 0 " + iL + " " + archY +
          " L " + iL + " " + legBottom + " Z";
      }

      /* Thread lines on left & right legs */
      const thdLines = [];
      for (let ty = threadTop; ty <= legBottom - 4; ty += 5) {
        thdLines.push(
          '<line x1="' + (cx - outerR) + '" y1="' + ty + '" x2="' + (cx - innerR) + '" y2="' + ty + '" stroke="' + strokeColor + '" stroke-width="1.1" />' +
          '<line x1="' + (cx + innerR) + '" y1="' + ty + '" x2="' + (cx + outerR) + '" y2="' + ty + '" stroke="' + strokeColor + '" stroke-width="1.1" />'
        );
      }

      /* Optional Hanger Bar for HANGER U-bolt */
      let hangerSvg = "";
      if (boltType === "HANGER") {
        const barY = archY + 34;
        const barW = 136;
        hangerSvg =
          '<rect x="' + (cx - barW / 2) + '" y="' + barY + '" width="' + barW + '" height="11" rx="2" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.1" />' +
          '<circle cx="' + (cx - barW / 2 + 10) + '" cy="' + (barY + 5.5) + '" r="2.5" fill="#FFFFFF" stroke="' + strokeColor + '" stroke-width="0.9" />' +
          '<circle cx="' + (cx + barW / 2 - 10) + '" cy="' + (barY + 5.5) + '" r="2.5" fill="#FFFFFF" stroke="' + strokeColor + '" stroke-width="0.9" />' +
          '<rect x="' + (cx - outerR - 3) + '" y="' + (barY + 11) + '" width="' + (barThick + 6) + '" height="7" rx="1" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1" />' +
          '<rect x="' + (cx + innerR - 3) + '" y="' + (barY + 11) + '" width="' + (barThick + 6) + '" height="7" rx="1" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1" />';
      }

      /* Leg length dimension on the right */
      const dimX = cx + outerR + 30;
      const legLabel = legRaw ? ("L = " + legRaw + " mm") : "L = ? mm";
      const legCol = legRaw ? reqColor : missingColor;
      const dimSvg =
        '<line x1="' + (cx + outerR + 4) + '" y1="' + (archY - outerR) + '" x2="' + (dimX + 6) + '" y2="' + (archY - outerR) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
        '<line x1="' + (cx + outerR + 4) + '" y1="' + legBottom + '" x2="' + (dimX + 6) + '" y2="' + legBottom + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
        '<line x1="' + dimX + '" y1="' + (archY - outerR + 3) + '" x2="' + dimX + '" y2="' + (legBottom - 3) + '" stroke="' + legCol + '" stroke-width="1" />' +
        '<polygon points="' + dimX + ',' + (archY - outerR) + ' ' + (dimX - 3) + ',' + (archY - outerR + 6) + ' ' + (dimX + 3) + ',' + (archY - outerR + 6) + '" fill="' + legCol + '" />' +
        '<polygon points="' + dimX + ',' + legBottom + ' ' + (dimX - 3) + ',' + (legBottom - 6) + ' ' + (dimX + 3) + ',' + (legBottom - 6) + '" fill="' + legCol + '" />' +
        '<text x="' + (dimX + 10) + '" y="' + (archY + 18) + '" text-anchor="start" font-size="11.5" font-weight="700" fill="' + legCol + '">' + esc(legLabel) + '</text>';

      shapeSvg =
        pipeRefSvg +
        '<path d="' + bodyPath + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="round" />' +
        thdLines.join("") +
        hangerSvg +
        dimSvg;

      infoStartY = legBottom + 32;
      const specs = [
        "Kind: " + (kind || "?"),
        "Type: " + (boltType || "?"),
        "Thread: " + (threadSize || "?") + " " + (threadType || "?")
      ];
      if (finish) specs.push("Finish: " + finish);
      specLines = wrapLines(specs.join("  |  "), 46);
    }

    const matLabel = material ? ("Material: " + material) : "Material: ?";
    const matCol = material ? reqColor : missingColor;

    const infoSvg =
      '<circle cx="132" cy="' + (infoStartY - 4) + '" r="5" fill="' + dotColor + '" stroke="' + strokeColor + '" stroke-width="1" />' +
      '<text x="142" y="' + infoStartY + '" text-anchor="start" font-size="12" font-weight="700" fill="' + matCol + '">' + esc(matLabel) + '</text>' +
      specLines.map(function (line, i) {
        const y = infoStartY + 18 + i * 16;
        return '<text x="190" y="' + y + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + optColor + '">' + esc(line) + '</text>';
      }).join("");

    const totalHeight = infoStartY + 18 + specLines.length * 16 + 12;

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="U bolt or U clamp technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          shapeSvg +
        '</g>' +
        infoSvg +
      '</svg>'
    );
  },

  /* Draw the U bolt / U clamp screen */
  renderScreen: function (container, goBack) {
    const mod = this;

    function makeOptionsHtml(items, placeholderText, includeOther) {
      const opts = placeholderText ? ['<option value="">' + placeholderText + '</option>'] : [];
      items.forEach(function (item) {
        if (item && typeof item === "object") {
          opts.push('<option value="' + item.code + '">' + item.label + '</option>');
        } else {
          opts.push('<option value="' + item + '">' + item + '</option>');
        }
      });
      if (includeOther) {
        opts.push('<option value="__OTHER__">Other (type it)</option>');
      }
      return opts.join("");
    }

    container.innerHTML =
      '<div class="item-header card-stagger" style="--card-index: 0;">' +
        '<button type="button" class="back-btn" id="ubolt-back-btn" aria-label="Back to Rules">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M15 18l-6-6 6-6"></path>' +
          '</svg>' +
        '</button>' +
        '<h1 class="item-screen-title">' + mod.name + '</h1>' +
      '</div>' +

      '<section class="card name-card card-stagger" style="--card-index: 1;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">SAP Short Text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="ubolt-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="ubolt-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="ubolt-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="ubolt-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="ubolt-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="ubolt-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="ubolt-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="ubolt-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="ubolt-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="ubolt-add-export-btn">Add to export list</button>' +
        '<p id="ubolt-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-kind">Kind</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-kind" class="field-control">' +
              makeOptionsHtml(mod.lists.kind, "Select kind", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-material">Material</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material", true) +
            '</select>' +
            '<input id="ubolt-material-other" type="text" class="field-control" style="display: none;" placeholder="Type material code" />' +
          '</div>' +

          /* U-BOLT SPECIFIC FIELDS */
          '<div class="field-group" data-ubolt-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-bolt-type">Type</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-bolt-type" class="field-control">' +
              makeOptionsHtml(mod.lists.uBoltType, "Select type", true) +
            '</select>' +
            '<input id="ubolt-bolt-type-other" type="text" class="field-control" style="display: none;" placeholder="Type U-bolt type" />' +
          '</div>' +

          '<div class="field-group" data-ubolt-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-bolt-pipe-size">Pipe size (inch)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-bolt-pipe-size" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Select pipe size", true) +
            '</select>' +
            '<input id="ubolt-bolt-pipe-size-other" type="text" class="field-control" style="display: none;" placeholder="Type inch size, e.g. 2.1/2" />' +
          '</div>' +

          '<div class="field-group" data-ubolt-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-leg-length">Leg length (mm)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="ubolt-leg-length" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 100" />' +
          '</div>' +

          '<div class="field-group" data-ubolt-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-thread-size">Thread size</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-thread-size" class="field-control">' +
              makeOptionsHtml(mod.lists.threadSize, "Select thread size", true) +
            '</select>' +
            '<input id="ubolt-thread-size-other" type="text" class="field-control" style="display: none;" placeholder="Type thread size, e.g. M14" />' +
          '</div>' +

          '<div class="field-group" data-ubolt-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-thread-type">Thread type</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-thread-type" class="field-control">' +
              makeOptionsHtml(mod.lists.threadType, "Select thread type", true) +
            '</select>' +
            '<input id="ubolt-thread-type-other" type="text" class="field-control" style="display: none;" placeholder="Type thread type" />' +
          '</div>' +

          '<div class="field-group" data-ubolt-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-thread-length">Thread length (long text only)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="ubolt-thread-length" class="field-control">' +
              makeOptionsHtml(mod.lists.threadLength, "Select thread length", false) +
            '</select>' +
          '</div>' +

          /* U-CLAMP SPECIFIC FIELDS */
          '<div class="field-group" data-uclamp-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-clamp-type">Type</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-clamp-type" class="field-control">' +
              makeOptionsHtml(mod.lists.uClampType, "Select type", true) +
            '</select>' +
            '<input id="ubolt-clamp-type-other" type="text" class="field-control" style="display: none;" placeholder="Type U-clamp type" />' +
          '</div>' +

          '<div class="field-group" data-uclamp-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-clamp-size-unit">Pipe size unit</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-clamp-size-unit" class="field-control">' +
              '<option value="Inch" selected>Inch</option>' +
              '<option value="mm">mm</option>' +
            '</select>' +
          '</div>' +

          '<div class="field-group" data-uclamp-inch-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-clamp-inch-size">Pipe size (inch OD)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-clamp-inch-size" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Select size", true) +
            '</select>' +
            '<input id="ubolt-clamp-inch-size-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 3.1/2" />' +
          '</div>' +

          '<div class="field-group" data-uclamp-mm-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-clamp-mm-size">Pipe size (mm OD)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="ubolt-clamp-mm-size" class="field-control">' +
              makeOptionsHtml(mod.lists.mmSize, "Select mm OD", true) +
            '</select>' +
            '<input id="ubolt-clamp-mm-size-other" type="text" class="field-control" style="display: none;" placeholder="Type mm OD, e.g. 60" />' +
          '</div>' +

          '<div class="field-group" data-uclamp-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-clamp-thread-hole">Thread size / hole</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="ubolt-clamp-thread-hole" class="field-control">' +
              makeOptionsHtml(mod.lists.threadSize, "None (optional)", true) +
            '</select>' +
            '<input id="ubolt-clamp-thread-hole-other" type="text" class="field-control" style="display: none;" placeholder="e.g. M8 or 10MM HOLE" />' +
          '</div>' +

          /* SHARED OPTIONAL FINISH */
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="ubolt-finish">Finish</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="ubolt-finish" class="field-control">' +
              makeOptionsHtml(mod.lists.finish, "Select finish", true) +
            '</select>' +
            '<input id="ubolt-finish-other" type="text" class="field-control" style="display: none;" placeholder="Type finish, e.g. SS PASSIVATED" />' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("ubolt-back-btn");
    const nameBox = document.getElementById("ubolt-name-box");
    const charCounter = document.getElementById("ubolt-char-counter");
    const missingNote = document.getElementById("ubolt-missing-note");
    const rebuildBtn = document.getElementById("ubolt-rebuild-btn");
    const copyBtn = document.getElementById("ubolt-copy-btn");
    const longBox = document.getElementById("ubolt-long-box");
    const longRebuildBtn = document.getElementById("ubolt-long-rebuild-btn");
    const longCopyBtn = document.getElementById("ubolt-long-copy-btn");
    const drawingFrame = document.getElementById("ubolt-drawing-frame");
    const addExportBtn = document.getElementById("ubolt-add-export-btn");
    const exportFeedback = document.getElementById("ubolt-export-feedback");

    const inputs = {
      kind: document.getElementById("ubolt-kind"),
      material: document.getElementById("ubolt-material"),
      materialOther: document.getElementById("ubolt-material-other"),
      boltType: document.getElementById("ubolt-bolt-type"),
      boltTypeOther: document.getElementById("ubolt-bolt-type-other"),
      boltPipeSize: document.getElementById("ubolt-bolt-pipe-size"),
      boltPipeSizeOther: document.getElementById("ubolt-bolt-pipe-size-other"),
      legLength: document.getElementById("ubolt-leg-length"),
      threadSize: document.getElementById("ubolt-thread-size"),
      threadSizeOther: document.getElementById("ubolt-thread-size-other"),
      threadType: document.getElementById("ubolt-thread-type"),
      threadTypeOther: document.getElementById("ubolt-thread-type-other"),
      threadLength: document.getElementById("ubolt-thread-length"),
      clampType: document.getElementById("ubolt-clamp-type"),
      clampTypeOther: document.getElementById("ubolt-clamp-type-other"),
      clampSizeUnit: document.getElementById("ubolt-clamp-size-unit"),
      clampInchSize: document.getElementById("ubolt-clamp-inch-size"),
      clampInchSizeOther: document.getElementById("ubolt-clamp-inch-size-other"),
      clampMmSize: document.getElementById("ubolt-clamp-mm-size"),
      clampMmSizeOther: document.getElementById("ubolt-clamp-mm-size-other"),
      clampThreadOrHole: document.getElementById("ubolt-clamp-thread-hole"),
      clampThreadOrHoleOther: document.getElementById("ubolt-clamp-thread-hole-other"),
      finish: document.getElementById("ubolt-finish"),
      finishOther: document.getElementById("ubolt-finish-other")
    };

    const uBoltGroups = Array.from(container.querySelectorAll('[data-ubolt-group="1"]'));
    const uClampGroups = Array.from(container.querySelectorAll('[data-uclamp-group="1"]'));
    const uClampInchGroups = Array.from(container.querySelectorAll('[data-uclamp-inch-group="1"]'));
    const uClampMmGroups = Array.from(container.querySelectorAll('[data-uclamp-mm-group="1"]'));

    function syncConditionalControls() {
      const isClamp = inputs.kind.value === "U-CLAMP";
      const isClampMm = inputs.clampSizeUnit.value === "mm";

      inputs.materialOther.style.display = inputs.material.value === "__OTHER__" ? "" : "none";
      inputs.finishOther.style.display = inputs.finish.value === "__OTHER__" ? "" : "none";

      uBoltGroups.forEach(function (el) { el.style.display = isClamp ? "none" : ""; });
      uClampGroups.forEach(function (el) { el.style.display = isClamp ? "" : "none"; });
      uClampInchGroups.forEach(function (el) { el.style.display = (isClamp && !isClampMm) ? "" : "none"; });
      uClampMmGroups.forEach(function (el) { el.style.display = (isClamp && isClampMm) ? "" : "none"; });

      inputs.boltTypeOther.style.display = (!isClamp && inputs.boltType.value === "__OTHER__") ? "" : "none";
      inputs.boltPipeSizeOther.style.display = (!isClamp && inputs.boltPipeSize.value === "__OTHER__") ? "" : "none";
      inputs.threadSizeOther.style.display = (!isClamp && inputs.threadSize.value === "__OTHER__") ? "" : "none";
      inputs.threadTypeOther.style.display = (!isClamp && inputs.threadType.value === "__OTHER__") ? "" : "none";

      inputs.clampTypeOther.style.display = (isClamp && inputs.clampType.value === "__OTHER__") ? "" : "none";
      inputs.clampInchSizeOther.style.display = (isClamp && !isClampMm && inputs.clampInchSize.value === "__OTHER__") ? "" : "none";
      inputs.clampMmSizeOther.style.display = (isClamp && isClampMm && inputs.clampMmSize.value === "__OTHER__") ? "" : "none";
      inputs.clampThreadOrHoleOther.style.display = (isClamp && inputs.clampThreadOrHole.value === "__OTHER__") ? "" : "none";
    }

    function readFieldValues() {
      const out = {};
      Object.keys(inputs).forEach(function (k) {
        out[k] = inputs[k].value;
      });
      return out;
    }

    function clearExportFeedback() {
      exportFeedback.textContent = "";
      exportFeedback.className = "add-export-feedback is-hidden";
    }

    function showExportFeedback(message, isError) {
      exportFeedback.textContent = message;
      exportFeedback.className = "add-export-feedback " + (isError ? "is-error" : "is-success");
    }

    function updateStatusDisplay() {
      const len = nameBox.value.length;
      const isOver = len > 40;
      const isNear = len >= 36 && !isOver;

      nameBox.classList.toggle("is-over", isOver);
      charCounter.classList.toggle("is-near", isNear);
      charCounter.classList.toggle("is-over", isOver);
      charCounter.textContent = isOver ? ("Too long: " + len + " / 40") : (len + " / 40");

      const missing = mod.getMissingRequired(readFieldValues());
      if (missing.length > 0) {
        missingNote.textContent = "Missing: " + missing.join(", ");
        missingNote.classList.remove("is-hidden");
      } else {
        missingNote.textContent = "";
        missingNote.classList.add("is-hidden");
      }
    }

    function updateDrawing() {
      drawingFrame.innerHTML = mod.buildDrawingSvg(readFieldValues(), nameBox.value);
    }

    function rebuildShortFromFields() {
      syncConditionalControls();
      nameBox.value = mod.buildShortText(readFieldValues());
      updateStatusDisplay();
      updateDrawing();
      clearExportFeedback();
    }

    function rebuildLongFromFields() {
      syncConditionalControls();
      longBox.value = mod.buildLongText(readFieldValues());
    }

    function rebuildAllFromFields() {
      rebuildShortFromFields();
      rebuildLongFromFields();
    }

    function copyTextarea(textarea, buttonEl) {
      const textToCopy = textarea.value;
      const showCopied = function () {
        buttonEl.textContent = "Copied";
        setTimeout(function () {
          buttonEl.textContent = "Copy";
        }, 1400);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(showCopied).catch(function () {
          textarea.select();
          document.execCommand("copy");
          showCopied();
        });
      } else {
        textarea.select();
        document.execCommand("copy");
        showCopied();
      }
    }

    Object.keys(inputs).forEach(function (key) {
      const el = inputs[key];
      el.addEventListener("input", rebuildAllFromFields);
      el.addEventListener("change", rebuildAllFromFields);
    });

    nameBox.addEventListener("input", function () {
      const start = nameBox.selectionStart;
      const end = nameBox.selectionEnd;
      const upper = nameBox.value.toUpperCase();
      if (nameBox.value !== upper) {
        nameBox.value = upper;
        if (typeof start === "number" && typeof end === "number") {
          nameBox.setSelectionRange(start, end);
        }
      }
      updateStatusDisplay();
      updateDrawing();
      clearExportFeedback();
    });

    rebuildBtn.addEventListener("click", rebuildShortFromFields);

    copyBtn.addEventListener("click", function () {
      copyTextarea(nameBox, copyBtn);
    });

    longRebuildBtn.addEventListener("click", rebuildLongFromFields);

    longCopyBtn.addEventListener("click", function () {
      copyTextarea(longBox, longCopyBtn);
    });

    addExportBtn.addEventListener("click", function () {
      const values = readFieldValues();
      const shortName = String(nameBox.value || "").trim();
      const longText = String(longBox.value || "").trim();
      const missing = mod.getMissingRequired(values);
      const reasons = [];

      if (missing.length > 0) {
        reasons.push("Missing required: " + missing.join(", "));
      }
      if (!shortName) {
        reasons.push("Short name is empty");
      } else if (shortName.length > 40) {
        reasons.push("Short name is over 40 characters (" + shortName.length + " / 40)");
      }

      if (reasons.length > 0) {
        showExportFeedback("Cannot add: " + reasons.join(". ") + ".", true);
        return;
      }

      const newCount = QSExport.add({
        moduleId: mod.id,
        moduleName: mod.name,
        shortName: shortName,
        longText: longText,
        fields: values,
        sapDefaults: {
          materialType: mod.exportDefaults.materialType,
          baseUnit: mod.exportDefaults.baseUnit,
          materialGroup: mod.exportDefaults.materialGroup
        }
      });

      showExportFeedback(
        "Added. " + newCount + (newCount === 1 ? " item" : " items") + " in the list",
        false
      );
    });

    backBtn.addEventListener("click", goBack);

    rebuildAllFromFields();
  }
});
