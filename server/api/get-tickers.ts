import YahooFinance from "yahoo-finance2";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const search = query.search as string;

    if (!search || !search.trim() || search.length < 3) return [];

    const yahooFinance = new YahooFinance();

    const tickers = await yahooFinance.search(search);

    return tickers;
});
