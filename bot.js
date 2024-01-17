import { Bot } from "grammy";
import OpenAI from "openai";
import dotenv from "dotenv";
import { sequentialize, run } from "@grammyjs/runner";

dotenv.config();

const openaiApiKey = process.env.OPENAI_TOKEN;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

const openai = new OpenAI({
    apiKey: openaiApiKey,
});

const bot = new Bot(telegramBotToken);

bot.use(
    sequentialize((ctx) => {
        const chat = ctx.chat?.id.toString();
        const user = ctx.from?.id.toString();
        return [chat, user].filter((con) => con !== undefined);
    })
);

bot.on("message", async (ctx) => {
    try {
        ctx.reply("Подождите пожалуйста...");
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: ctx.update.message.text }],
            model: "gpt-3.5-turbo",
        });

        ctx.reply(completion.choices[0].message.content);
    } catch (error) {
        console.error("Error calling OpenAI API:", error.message);
        throw error;
    }
});

run(bot);
console.log("Bot started");
