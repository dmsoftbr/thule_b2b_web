import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MlaService } from "@/services/mla/mla.service";
import { setDatasulCreds } from "@/lib/datasul-session";
import { handleError } from "@/lib/api";
import { toast } from "sonner";

interface Props {
  onConnected: () => void;
  onCancel: () => void;
}

// Gate de conexão ao Datasul, renderizado INLINE (não-modal) para não bloquear a
// sidebar/menu — o usuário pode sair da tela a qualquer momento. Coleta usuário+senha,
// valida via API (mla/login) e guarda as credenciais só em memória (datasul-session).
export function DatasulLoginGate({ onConnected, onCancel }: Props) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnect = async () => {
    if (!usuario || !senha) {
      toast.error("Informe usuário e senha do Datasul.");
      return;
    }
    try {
      setIsSubmitting(true);
      await MlaService.login(usuario, senha);
      setDatasulCreds(usuario, senha);
      setSenha("");
      onConnected();
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Conectar ao Datasul</CardTitle>
          <CardDescription>
            Informe suas credenciais do Datasul para consultar e aprovar as
            pendências (alçada) MLA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleConnect();
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="mla-usuario">Usuário Datasul</Label>
              <Input
                id="mla-usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="mla-senha">Senha</Label>
              <PasswordInput
                id="mla-senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Conectando..." : "Conectar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
