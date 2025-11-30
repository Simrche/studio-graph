import YahooFinance from "yahoo-finance2";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const symbol = query.symbol as string;
    const years = parseInt(query.years as string) || 1;

    const end = new Date();
    const start = new Date();

    start.setDate(0);
    start.setMonth(0);
    start.setFullYear(end.getFullYear() - years);

    const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

    return yahooFinance.historical(symbol, {
        period1: start,
        period2: end,
        interval: "1wk",
    });
});
