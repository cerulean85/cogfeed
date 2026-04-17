export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cogfeed.dycdyp.com";

export const siteMeta = {
  name: "CogFeed",
  url: siteUrl,
  ko: {
    title: "CogFeed — AI 인지 오류 피드백 서비스",
    description: "AI가 당신의 기록을 실시간으로 분석해 인지 오류를 진단하고 개인화 피드백을 제공합니다.",
  },
  en: {
    title: "CogFeed — AI Cognitive Feedback Service",
    description: "AI analyzes your notes in real time to diagnose cognitive errors and deliver personalized feedback.",
  },
};
