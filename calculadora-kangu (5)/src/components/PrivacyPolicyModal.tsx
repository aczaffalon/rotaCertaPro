import React from 'react';
import { ExternalLink, FileText, Shield, X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title" className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-zinc-900 sm:rounded-3xl">
        <header className="flex items-start justify-between border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-yellow-400 p-2 text-zinc-950"><Shield className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-yellow-600 dark:text-yellow-400">Rota Certa</p>
              <h2 id="privacy-modal-title" className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Política de Privacidade</h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Última atualização: 8 de setembro de 2026</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fechar política de privacidade" className="min-h-11 min-w-11 rounded-xl p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 overflow-y-auto p-5 text-sm leading-6 text-zinc-700 dark:text-zinc-300 sm:p-6">
          <p>O Rota Certa foi desenvolvido para calcular e acompanhar ganhos de rotas. Esta política explica, de forma clara, como os dados são tratados no aplicativo.</p>

          <section>
            <h3 className="mb-2 text-base font-bold text-zinc-950 dark:text-zinc-50">Dados armazenados</h3>
            <p>Os cálculos de rotas, histórico, configurações e preferências de tema são armazenados localmente no aparelho, usando o armazenamento do aplicativo. O Rota Certa não exige conta de usuário e não mantém servidor próprio para esses dados.</p>
          </section>

          <section>
            <h3 className="mb-2 text-base font-bold text-zinc-950 dark:text-zinc-50">Backup manual</h3>
            <p>Você pode exportar manualmente um arquivo de backup com histórico e configurações. O arquivo só é criado quando você solicita a exportação e é salvo ou compartilhado pelo sistema do aparelho. A importação também depende de uma ação sua.</p>
          </section>

          <section>
            <h3 className="mb-2 text-base font-bold text-zinc-950 dark:text-zinc-50">Compartilhamento</h3>
            <p>Ao exportar um PDF ou backup, o aplicativo abre o recurso de compartilhamento do aparelho. O conteúdo será enviado somente ao aplicativo ou pessoa que você escolher. O Rota Certa não controla o tratamento feito por esses terceiros.</p>
          </section>

          <section>
            <h3 className="mb-2 text-base font-bold text-zinc-950 dark:text-zinc-50">Coleta e publicidade</h3>
            <p>O Rota Certa não coleta dados pessoais para uma conta, não vende informações, não mantém servidor de analytics próprio e não solicita dados de localização. A disponibilidade de recursos do sistema, como compartilhamento e armazenamento, depende do Android.</p>
          </section>

          <section>
            <h3 className="mb-2 text-base font-bold text-zinc-950 dark:text-zinc-50">Exclusão</h3>
            <p>Você pode apagar o histórico pelas opções do aplicativo. Também pode remover os dados locais nas configurações do Android. Backups exportados anteriormente precisam ser excluídos por você no local onde foram salvos ou compartilhados.</p>
          </section>

          <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-950 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-100">
            <h3 className="mb-2 text-base font-bold">Contato de suporte</h3>
            <p>Para dúvidas sobre privacidade ou suporte, entre em contato pelo e-mail:</p>
            <p className="mt-2 break-words font-bold">aczaffalon@gmail.com</p>
          </section>

          <a href="/privacy.html" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-zinc-900 underline decoration-yellow-400 decoration-2 underline-offset-4 dark:text-zinc-100">
            <FileText className="h-4 w-4" /> Abrir política completa <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
