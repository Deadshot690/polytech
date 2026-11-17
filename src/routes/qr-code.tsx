import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/qr-code")({
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: typeof search.code === "string" ? search.code : undefined,
  }),
  component: QRCodeRedirect,
});

function QRCodeRedirect() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      to: "/business-profile",
      search: search.code ? { code: search.code } : undefined,
      replace: true,
    });
  }, [search.code, navigate]);

  return null;
}
