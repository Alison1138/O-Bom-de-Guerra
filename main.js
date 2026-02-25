// Utilitário para carregar um partial dentro de um container
async function injectPartial(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const url = container.getAttribute("data-partial");
  if (!url) return;

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Falha ao carregar ${url}: ${res.status}`);
    const html = await res.text();
    container.innerHTML = html;

    // Pós-processamento específico de cada partial
    if (containerSelector === "#site-footer") {
      const yearSpan = container.querySelector("#year");
      if (yearSpan) yearSpan.textContent = new Date().getFullYear();
      wireNewsletter(container);
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="container"><p class="muted">Não foi possível carregar o componente.</p></div>`;
  }
}

// Atribui behavior ao botão de demonstração (data-action)
function wireGlobalActions() {
  document.querySelectorAll("[data-action='mostrar-alerta']").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Obrigado por se tornar um bom de guerra!");
    });
  });
}

// Newsletter do footer (simulação sem backend)
function wireNewsletter(root) {
  const form = root.querySelector("#newsletter-form");
  const input = root.querySelector("#nl-email");
  const feedback = root.querySelector("#nl-feedback");
  if (!form || !input || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!input.checkValidity()) {
      feedback.textContent = "Por favor, insira um e-mail válido.";
      return;
    }
    feedback.textContent = "Inscrição realizada com sucesso! ✅";
    form.reset();
  });
}

// Formulário de contato (somente se existir)
function wireContato() {
  const form = document.querySelector("#contato-form");
  const feedback = document.querySelector("#contato-feedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      feedback.textContent = "Preencha todos os campos corretamente.";
      return;
    }

    // Simulação
    feedback.textContent = "Mensagem enviada! Retornaremos em breve. ✉️";
    form.reset();
  });
}

// Boot
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    injectPartial("#site-header"),
    injectPartial("#site-footer"),
  ]);

  wireGlobalActions();
  wireContato();
});