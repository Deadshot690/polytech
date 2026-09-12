import { createContext, useContext, useState, type ReactNode } from "react";

interface LeadContextValue {
  open: boolean;
  product?: string;
  openLead: (product?: string) => void;
  closeLead: () => void;
}

const LeadContext = createContext<LeadContextValue | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<string | undefined>();

  return (
    <LeadContext.Provider
      value={{
        open,
        product,
        openLead: (p) => {
          setProduct(p);
          setOpen(true);
        },
        closeLead: () => setOpen(false),
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLead must be used within LeadProvider");
  return ctx;
}
