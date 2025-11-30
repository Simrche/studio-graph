import YahooFinance from "yahoo-finance2";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const symbol = query.symbol as string;

    const end = new Date((query?.end as string) || new Date());
    const start = new Date((query?.start as string) || new Date());

    const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

    return yahooFinance.chart(symbol, {
        period1: start,
        period2: end,
        interval: "1wk",
    });
});
