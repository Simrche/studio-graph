import YahooFinance from "yahoo-finance2";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const symbol = query.symbol as string;

    const yahooFinance = new YahooFinance();

    const info = await yahooFinance.quoteSummary(symbol, {
        modules: ["assetProfile"],
    });

    const website = info.assetProfile?.website;

    if (!website) return;

    const domain = website
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0];
    return { logoUrl: `https://logo.clearbit.com/${domain}` };
});
