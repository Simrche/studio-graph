import YahooFinance from "yahoo-finance2";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const search = query.search as string;

    const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

    const tickers = await yahooFinance.search(search);

    return tickers;
});
