import { Providers } from './providers';
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export const metadata = {
  title: 'Mauve Studio',
  description: 'AI-powered furniture design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('mauve_theme') || 'light';
              var r = document.documentElement;
              if (t === 'dark') {
                document.body && (document.body.style.background = 'linear-gradient(135deg,#0f0f1a,#1a1030,#0f1a1a)');
                r.setAttribute('data-theme', 'dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body>
        <ThemeProvider>
  <Providers>
    {children}
  </Providers>
</ThemeProvider>
      </body>
    </html>
  )
}
