"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type RoleAnimation = {
  visible: string;
  roles: readonly string[];
  logs: string[];
};
const Context = createContext<RoleAnimation | null>(null);

/** A single clock keeps the header and profile code synchronized. */
export function RoleAnimationProvider({
  roles,
  children,
}: {
  roles: readonly string[];
  children: ReactNode;
}) {
  const [state, setState] = useState({ visible: "", logs: [] as string[] });
  const phrasesKey = JSON.stringify(roles.filter(Boolean));
  useEffect(() => {
    const phrases: string[] = JSON.parse(phrasesKey);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    function restart() {
      clearTimeout(timer);
      let phrase = 0;
      let index = 0;
      let deleting = false;
      setState({
        visible: preference.matches ? (phrases[0] ?? "") : "",
        logs: preference.matches && phrases.length ? [phrases[0]] : [],
      });
      if (preference.matches || !phrases.length) return;
      function tick() {
        const role = phrases[phrase];
        const characters = Array.from(role);
        index += deleting ? -1 : 1;
        const complete = !deleting && index === characters.length;
        const visible = characters.slice(0, index).join("");
        setState((previous) => ({
          visible,
          logs: complete ? [...previous.logs, role].slice(-2) : previous.logs,
        }));
        let delay = deleting ? 45 : 85;
        if (index === 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          delay = 450;
        } else if (complete) {
          deleting = true;
          delay = 1800;
        }
        timer = setTimeout(tick, delay);
      }
      timer = setTimeout(tick, 250);
    }
    restart();
    preference.addEventListener("change", restart);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener("change", restart);
    };
  }, [phrasesKey]);
  return (
    <Context.Provider value={{ ...state, roles }}>{children}</Context.Provider>
  );
}

export function useRoleAnimation() {
  const value = useContext(Context);
  if (!value) throw new Error("Role animation requires RoleAnimationProvider");
  return value;
}
