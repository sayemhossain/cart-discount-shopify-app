import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { i18nServer } from "./i18n/config";

export const meta = ({ data }) => ({
  charset: "utf-8",
  title: data.title,
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }) {
  return json({ locale: await i18nServer.getLocale(request) });
}

export default function App() {
  const { locale } = useLoaderData();
  const { i18n } = useTranslation();

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}
