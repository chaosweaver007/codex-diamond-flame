import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AudioProvider } from "./contexts/AudioContext";
import { MirrorProvider } from "./contexts/MirrorContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Codex from "./pages/Codex";
import SynthsaraOrg from "./pages/SynthsaraOrg";
import PaymentHistory from "./pages/PaymentHistory";
import Settings from "./pages/Settings";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/codex"} component={Codex} />
      <Route path={"/synthsara-org"} component={SynthsaraOrg} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/payments"} component={PaymentHistory} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <AudioProvider>
          <MirrorProvider>
            <TooltipProvider>
            <Toaster />
              <Router />
            </TooltipProvider>
          </MirrorProvider>
        </AudioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
