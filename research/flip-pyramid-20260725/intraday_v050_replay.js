(() => {
  const data = window.INTRADAY_EVIDENCE;
  const root = document.getElementById("intradayModel");
  if (!data || !root) {
    if (root) root.innerHTML = '<div class="empty">Intraday evidence is missing.</div>';
    return;
  }

  const tabs = [
    ["overview", "Intraday overview"],
    ["risk15", "15% weekly"],
    ["risk5", "5% weekly"],
    ["v05", "94 v0.5 trades"],
    ["matrix", "Gold + silver matrix"],
    ["research", "Research charts"],
    ["range", "Range near-miss"],
  ];
  let active = "overview";
  let replayIndex = Math.max(0, data.v05Replays.length - 1);
  let researchIndex = 0;
  let rangeIndex = 0;
  let activeChart = null;

  const money = value => new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(Number(value || 0));
  const number = (value, digits = 2) => value == null ? "—" :
    Number(value).toLocaleString("en-US", { maximumFractionDigits: digits });
  const pct = value => value == null ? "—" : `${number(value, 2)}%`;
  const label = value => String(value || "—").replaceAll("_", " ");
  const awst = value => new Date(value).toLocaleString("en-AU", {
    timeZone: "Australia/Perth", day: "2-digit", month: "short",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  function metric(name, value) {
    return `<div class="metric"><label>${name}</label><strong>${value}</strong></div>`;
  }

  function setTabs() {
    document.getElementById("intradayTabs").innerHTML = tabs.map(([id, text]) =>
      `<button class="${active === id ? "active" : ""}" data-intraday-tab="${id}">${text}</button>`
    ).join("");
    document.querySelectorAll("[data-intraday-tab]").forEach(button => {
      button.onclick = () => {
        active = button.dataset.intradayTab;
        render();
      };
    });
  }

  function overview() {
    const gold = data.movementAudit.XAUUSD;
    const silver = data.movementAudit.XAGUSD;
    const real = data.v05Metrics.realticks;
    const rangeTop = data.rangeResearch?.report?.topRows?.[0];
    root.innerHTML = `
      <div class="analysis-note">
        <strong>Current ruling:</strong> frozen v0.5 is a BUY-only trend-expansion
        candidate. It passed the historical entry gate, but it did not double a
        fresh account in any of the 79 isolated weekly tests. The two RoboForex
        demos are measuring forward execution, not proving a weekly flip claim.
      </div>
      <div class="evidence-summary">
        ${metric("MT5 trades", real.full.trades)}
        ${metric("Full PF", number(real.full.profit_factor_est))}
        ${metric("Validation PF", number(real["2026"].profit_factor_est))}
        ${metric("Active weeks", "49 / 79")}
        ${metric("15% best week", money(data.weeklyModes[0].summary.bestFinalBalance))}
        ${metric("15% worst week", money(data.weeklyModes[0].summary.worstFinalBalance))}
        ${metric("Observed blows", "0")}
        ${metric("Range full PF", number(rangeTop?.full?.profitFactor))}
        ${metric("Range 2026 PF", number(rangeTop?.unseen?.profitFactor))}
      </div>
      <div class="movement-grid">
        <article class="movement-band">
          <h3>Gold movement facts</h3>
          <div class="metric-grid compact">
            ${metric("Days measured", gold.days)}
            ${metric("Median daily range", `${number(gold.medianRangePips)}p`)}
            ${metric("500p range days", `${gold.range500Days} · ${pct(gold.range500Pct)}`)}
            ${metric("1000p range days", `${gold.range1000Days} · ${pct(gold.range1000Pct)}`)}
            ${metric("500p net days", `${gold.net500Days} · ${pct(gold.net500Pct)}`)}
          </div>
        </article>
        <article class="movement-band">
          <h3>Silver movement facts</h3>
          <div class="metric-grid compact">
            ${metric("Days measured", silver.days)}
            ${metric("Median daily range", `${number(silver.medianRangePips)}p`)}
            ${metric("500p range days", `${silver.range500Days} · ${pct(silver.range500Pct)}`)}
            ${metric("1000p range days", `${silver.range1000Days} · ${pct(silver.range1000Pct)}`)}
            ${metric("500p net days", `${silver.net500Days} · ${pct(silver.net500Pct)}`)}
          </div>
        </article>
      </div>
      <p class="detail">
        The data confirms frequent large gold ranges, but not a clean 500–1000
        pip one-way move every day. A large high-low range can travel both ways;
        entry timing and invalidation remain the edge.
      </p>
      <p class="detail">
        The nested range study screened ${data.rangeResearch?.report?.rows || 0}
        rows. Its strongest gold configuration reached full PF
        ${number(rangeTop?.full?.profitFactor)} across ${rangeTop?.full?.trades || 0}
        trades and 2026 PF ${number(rangeTop?.unseen?.profitFactor)}, but only
        ${rangeTop?.unseen?.trades || 0} unseen trades. It remains a near-miss,
        not an approved bot.
      </p>`;
  }

  function weekly(modeId) {
    const mode = data.weeklyModes.find(item => item.id === modeId);
    const summary = mode.summary;
    root.innerHTML = `
      <p class="detail"><strong>${mode.label}</strong> · every Monday-to-Monday
        window restarted from $5,000.</p>
      <div class="evidence-summary">
        ${metric("Weeks", summary.totalWeeks)}
        ${metric("Traded", summary.tradedWeeks)}
        ${metric("Active", pct(summary.activeWeekPct))}
        ${metric("Profitable", `${summary.profitableTradedWeeks} / ${summary.tradedWeeks}`)}
        ${metric("Losing", summary.losingTradedWeeks)}
        ${metric("Best final", money(summary.bestFinalBalance))}
        ${metric("Worst final", money(summary.worstFinalBalance))}
        ${metric("Blows", summary.accountBlows)}
      </div>
      <div class="table-wrap intraday-table">
        <table>
          <thead><tr><th>Week</th><th>Start</th><th>Outcome</th><th>Trades</th>
            <th>Final balance</th><th>P/L</th><th>Return</th></tr></thead>
          <tbody>${mode.rows.map(row => `<tr>
            <td>${row.week}</td><td>${row.start}</td>
            <td><span class="status ${row.classification}">${label(row.classification)}</span></td>
            <td>${row.trades}</td><td>${money(row.finalBalance)}</td>
            <td>${money(row.pnl)}</td><td>${pct(row.returnPct)}</td>
          </tr>`).join("")}</tbody>
        </table>
      </div>`;
  }

  function destroyChart() {
    if (activeChart) {
      activeChart.remove();
      activeChart = null;
    }
  }

  function priceLine(series, value, title, color, style = 2) {
    if (value == null || !Number.isFinite(Number(value))) return;
    series.createPriceLine({
      price: Number(value), title, color, lineWidth: 1, lineStyle: style,
      axisLabelVisible: true,
    });
  }

  function drawReplay(row, targetId, research = false) {
    destroyChart();
    const target = document.getElementById(targetId);
    if (!target || !row.candles?.length) return;
    activeChart = LightweightCharts.createChart(target, {
      autoSize: true,
      layout: { background: { color: "#0e1211" }, textColor: "#aab5b0" },
      grid: { vertLines: { color: "#18201d" }, horzLines: { color: "#18201d" } },
      rightPriceScale: { borderColor: "#29322f" },
      timeScale: { borderColor: "#29322f", timeVisible: true, secondsVisible: false },
      crosshair: { mode: 0 },
    });
    const candles = activeChart.addSeries(LightweightCharts.CandlestickSeries, {
      upColor: "#35d69a", downColor: "#ff6678", borderVisible: false,
      wickUpColor: "#35d69a", wickDownColor: "#ff6678",
      priceFormat: { type: "price", precision: row.symbol === "XAGUSD" ? 3 : 2,
        minMove: row.symbol === "XAGUSD" ? 0.001 : 0.01 },
    });
    candles.setData(row.candles);
    const markers = row.events.map(event => {
      const buy = row.direction === "BUY";
      const kind = event.kind;
      const isEntry = kind === "entry";
      const isExit = kind === "exit";
      return {
        time: Math.floor(new Date(event.time).getTime() / 1000),
        position: isExit ? (buy ? "aboveBar" : "belowBar") :
          (buy ? "belowBar" : "aboveBar"),
        color: isEntry ? "#67a8ff" : isExit ? "#ffffff" :
          kind === "arm" || kind === "signal" ? "#b481ff" : "#f0c45a",
        shape: isEntry ? (buy ? "arrowUp" : "arrowDown") :
          isExit ? "circle" : "square",
        text: event.label,
      };
    }).sort((a, b) => a.time - b.time);
    LightweightCharts.createSeriesMarkers(candles, markers);
    priceLine(candles, row.entry, "ENTRY", "#67a8ff");
    priceLine(candles, row.stop, "STOP", "#ff6678");
    priceLine(candles, row.target, "TARGET", "#35d69a");
    priceLine(candles, row.zoneLow, "PULLBACK ZONE", "#f0c45a", 3);
    priceLine(candles, row.zoneHigh, "PULLBACK ZONE", "#f0c45a", 3);
    if (research) priceLine(candles, row.level, "STRUCTURE", "#b481ff", 3);
    activeChart.timeScale().fitContent();
  }

  function v05Replay() {
    const row = data.v05Replays[replayIndex];
    root.innerHTML = `
      <div class="replay-layout">
        <div class="replay-list">
          ${data.v05Replays.map((item, index) => `<button
            class="campaign ${item.pnlPips >= 0 ? "win" : "loss"} ${index === replayIndex ? "active" : ""}"
            data-v05-replay="${index}">
            <span>#${item.number} · ${awst(item.entryTime)}<br><small>${item.reason}</small></span>
            <strong>${number(item.pnlPips, 1)}p</strong>
          </button>`).join("")}
        </div>
        <div class="replay-main">
          <h3>Trade #${row.number} · ${row.direction} · ${awst(row.entryTime)}</h3>
          <div class="metric-grid">
            ${metric("Entry", number(row.entry))}
            ${metric("Stop", number(row.stop))}
            ${metric("Target", number(row.target))}
            ${metric("Lots at 0.5%", number(row.lots))}
            ${metric("Result", `${number(row.pnlPips, 1)}p`)}
            ${metric("Exit", row.reason)}
            ${metric("MFE", `${number(row.mfePips, 1)}p`)}
            ${metric("MAE", `${number(row.maePips, 1)}p`)}
          </div>
          <div class="legend">
            <span><i class="dot" style="background:#b481ff"></i>H1 arm</span>
            <span><i class="dot" style="background:#f0c45a"></i>Pullback retest</span>
            <span><i class="dot" style="background:#67a8ff"></i>Entry</span>
            <span><i class="dot" style="background:#ffffff"></i>Exit</span>
          </div>
          <div class="chart-card"><div class="intraday-chart" id="intradayPriceChart"></div></div>
        </div>
      </div>`;
    document.querySelectorAll("[data-v05-replay]").forEach(button => {
      button.onclick = () => {
        replayIndex = Number(button.dataset.v05Replay);
        render();
      };
    });
    requestAnimationFrame(() => drawReplay(row, "intradayPriceChart"));
  }

  function matrix() {
    const sorted = [...data.researchMatrix].sort((a, b) => {
      const aFloor = Math.min(a.development.profitFactor || 0, a.unseen.profitFactor || 0);
      const bFloor = Math.min(b.development.profitFactor || 0, b.unseen.profitFactor || 0);
      return bFloor - aFloor;
    });
    root.innerHTML = `
      <div class="analysis-note">
        <strong>Promotion result:</strong> 0 of ${sorted.length} simple
        strategy × metal rows passed PF ≥1.30 in both development and unseen,
        ≥30 unseen trades, and ≥50% unseen weekly activity. Rejected rows are
        shown because failed ideas are part of the evidence.
      </div>
      <div class="table-wrap intraday-table">
        <table>
          <thead><tr><th>Metal</th><th>Entry thesis</th><th>Mode</th><th>R:R</th>
            <th>Dev PF</th><th>Dev trades</th><th>Unseen PF</th><th>Unseen trades</th>
            <th>Unseen activity</th><th>Full PF</th><th>Verdict</th></tr></thead>
          <tbody>${sorted.map(row => `<tr>
            <td>${row.symbol}</td><td>${label(row.thesis)}</td><td>${row.variant}</td>
            <td>${number(row.reward)}R</td><td>${number(row.development.profitFactor)}</td>
            <td>${row.development.trades}</td><td>${number(row.unseen.profitFactor)}</td>
            <td>${row.unseen.trades}</td><td>${pct(row.unseen.activeWeekPct)}</td>
            <td>${number(row.full.profitFactor)}</td>
            <td><span class="status ${row.promotionGate ? "profit" : "loss"}">${row.promotionGate ? "PASS" : "REJECT"}</span></td>
          </tr>`).join("")}</tbody>
        </table>
      </div>`;
  }

  function research() {
    const row = data.researchReplays[researchIndex];
    root.innerHTML = `
      <div class="replay-layout">
        <div class="replay-list">
          ${data.researchReplays.map((item, index) => `<button
            class="campaign ${item.pnlR >= 0 ? "win" : "loss"} ${index === researchIndex ? "active" : ""}"
            data-research-replay="${index}">
            <span>${item.symbol} · ${label(item.thesis)}<br><small>${awst(item.entryTime)}</small></span>
            <strong>${number(item.pnlR)}R</strong>
          </button>`).join("")}
        </div>
        <div class="replay-main">
          <h3>${row.symbol} · ${label(row.thesis)} · ${row.direction}</h3>
          <div class="metric-grid">
            ${metric("Entry", number(row.entry, 3))}
            ${metric("Stop", number(row.stop, 3))}
            ${metric("Target", number(row.target, 3))}
            ${metric("Result", `${number(row.pnlR)}R`)}
            ${metric("MFE", `${number(row.mfeR)}R`)}
            ${metric("MAE", `${number(row.maeR)}R`)}
          </div>
          <p class="detail">This chart is a tested candidate example, not a
            promoted bot. The full pass/fail result is in the matrix.</p>
          <div class="chart-card"><div class="intraday-chart" id="researchPriceChart"></div></div>
        </div>
      </div>`;
    document.querySelectorAll("[data-research-replay]").forEach(button => {
      button.onclick = () => {
        researchIndex = Number(button.dataset.researchReplay);
        render();
      };
    });
    requestAnimationFrame(() => drawReplay(row, "researchPriceChart", true));
  }

  function rangeResearch() {
    const report = data.rangeResearch.report;
    const top = report.topRows[0];
    const row = data.rangeResearch.replays[rangeIndex];
    root.innerHTML = `
      <div class="analysis-note">
        <strong>Range thesis verdict:</strong> ${report.promotionPasses} of
        ${report.rows} rows passed. The strongest gold row was profitable in
        development, validation, and 2026, but the unseen sample contained only
        ${top.unseen.trades} trades, below the 30-trade evidence gate.
      </div>
      <div class="evidence-summary">
        ${metric("Full PF", number(top.full.profitFactor))}
        ${metric("Full trades", top.full.trades)}
        ${metric("Full win rate", pct(top.full.winRatePct))}
        ${metric("2026 PF", number(top.unseen.profitFactor))}
        ${metric("2026 trades", top.unseen.trades)}
        ${metric("2026 activity", pct(top.unseen.activeWeekPct))}
        ${metric("Development PF", number(top.development.profitFactor))}
        ${metric("Validation PF", number(top.validation.profitFactor))}
      </div>
      <div class="replay-layout">
        <div class="replay-list">
          ${data.rangeResearch.replays.map((item, index) => `<button
            class="campaign ${item.pnlR >= 0 ? "win" : "loss"} ${index === rangeIndex ? "active" : ""}"
            data-range-replay="${index}">
            <span>${item.direction} · ${awst(item.entryTime)}<br><small>${item.reason}</small></span>
            <strong>${number(item.pnlR)}R</strong>
          </button>`).join("")}
        </div>
        <div class="replay-main">
          <h3>Gold range failed-expansion · ${row.direction}</h3>
          <div class="metric-grid">
            ${metric("Entry", number(row.entry))}
            ${metric("Stop", number(row.stop))}
            ${metric("Target", number(row.target))}
            ${metric("Result", `${number(row.pnlR)}R`)}
            ${metric("MFE", `${number(row.mfeR)}R`)}
            ${metric("MAE", `${number(row.maeR)}R`)}
          </div>
          <p class="detail">This is the best nested range-family evidence. It is
            shown for inspection and remains below the promotion sample gate.</p>
          <div class="chart-card"><div class="intraday-chart" id="rangePriceChart"></div></div>
        </div>
      </div>`;
    document.querySelectorAll("[data-range-replay]").forEach(button => {
      button.onclick = () => {
        rangeIndex = Number(button.dataset.rangeReplay);
        render();
      };
    });
    requestAnimationFrame(() => drawReplay(row, "rangePriceChart", true));
  }

  function render() {
    destroyChart();
    setTabs();
    if (active === "overview") overview();
    if (active === "risk15") weekly("risk15");
    if (active === "risk5") weekly("risk5");
    if (active === "v05") v05Replay();
    if (active === "matrix") matrix();
    if (active === "research") research();
    if (active === "range") rangeResearch();
  }

  render();
})();
