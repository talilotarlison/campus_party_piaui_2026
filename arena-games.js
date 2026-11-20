const cards = [...document.querySelectorAll('.game-card')];
const searchInput = document.getElementById('gameSearch');
const resultLabel = document.getElementById('gameResults');
const emptyMessage = document.getElementById('noGames');
const filters = [...document.querySelectorAll('.game-filter')];
let activeFilter = 'all';

function normalizeText(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

function updateGames() {
    const query = normalizeText(searchInput.value.trim());
    let visibleCount = 0;

    cards.forEach(card => {
        const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
        const matchesQuery = normalizeText(card.dataset.search).includes(query);
        const visible = matchesFilter && matchesQuery;
        card.hidden = !visible;
        if (visible) visibleCount++;
    });

    resultLabel.textContent = `${String(visibleCount).padStart(2, '0')} ${visibleCount === 1 ? 'jogo encontrado' : 'jogos para explorar'}`;
    emptyMessage.hidden = visibleCount > 0;
}

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        activeFilter = filter.dataset.filter;
        filters.forEach(button => {
            const selected = button === filter;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        updateGames();
    });
});

searchInput.addEventListener('input', updateGames);

document.getElementById('surprise').addEventListener('click', () => {
    const availableCards = cards.filter(card => !card.hidden);
    if (!availableCards.length) {
        searchInput.value = '';
        activeFilter = 'all';
        filters.forEach(filter => {
            const selected = filter.dataset.filter === 'all';
            filter.classList.toggle('active', selected);
            filter.setAttribute('aria-pressed', String(selected));
        });
        updateGames();
    }

    const choices = cards.filter(card => !card.hidden);
    const selected = choices[Math.floor(Math.random() * choices.length)];
    selected.classList.add('game-card-picked');
    selected.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => selected.classList.remove('game-card-picked'), 1500);
});

const pollVotes = new Map();

document.querySelectorAll('[data-poll-form]').forEach(form => {
    const pollId = form.dataset.pollForm;
    const options = [...form.querySelectorAll('input[type="radio"]')];
    const counts = new Map(options.map(option => [option.value, 0]));
    const results = document.querySelector(`[data-poll-results="${pollId}"]`);
    const message = document.querySelector(`[data-poll-message="${pollId}"]`);

    form.addEventListener('submit', event => {
        event.preventDefault();
        const selected = form.querySelector('input:checked')?.value;
        if (!selected) {
            message.textContent = 'Escolha uma opção antes de registrar seu voto.';
            return;
        }

        const previous = pollVotes.get(pollId);
        if (previous !== selected) {
            if (previous) counts.set(previous, counts.get(previous) - 1);
            counts.set(selected, counts.get(selected) + 1);
            pollVotes.set(pollId, selected);
        }

        const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
        results.querySelectorAll('.poll-result').forEach(result => {
            const count = counts.get(result.dataset.result);
            const percentage = Math.round(count / total * 100);
            result.querySelector('strong').textContent = `${count} ${count === 1 ? 'voto' : 'votos'} · ${percentage}%`;
            result.querySelector('.poll-bar span').style.width = `${percentage}%`;
        });
        results.hidden = false;
        message.textContent = previous === selected
            ? 'Seu voto já está registrado. Você pode mudar sua escolha.'
            : 'Voto registrado nesta sessão. Você pode mudar sua escolha.';
    });
});

document.getElementById('drawGame').addEventListener('click', () => {
    const selected = cards[Math.floor(Math.random() * cards.length)];
    const stage = document.querySelector('.raffle-stage');
    document.getElementById('drawnGame').textContent = selected.querySelector('h3').textContent;
    document.getElementById('drawnGenre').textContent = selected.querySelector('.game-genre').textContent;
    stage.classList.remove('raffle-result-active');
    window.requestAnimationFrame(() => stage.classList.add('raffle-result-active'));
});

const bannerSlides = [...document.querySelectorAll('.banner-slide')];
const bannerDots = [...document.querySelectorAll('.banner-dot')];
const bannerAutoplay = document.getElementById('bannerAutoplay');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeBanner = 0;
let bannerTimer;
let bannerPaused = prefersReducedMotion;

function showBanner(index) {
    activeBanner = (index + bannerSlides.length) % bannerSlides.length;
    bannerSlides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeBanner;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
    });
    bannerDots.forEach((dot, dotIndex) => {
        const active = dotIndex === activeBanner;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-pressed', String(active));
    });
}

function updateBannerTimer() {
    window.clearInterval(bannerTimer);
    bannerAutoplay.textContent = bannerPaused ? '▶' : 'Ⅱ';
    bannerAutoplay.setAttribute('aria-label', bannerPaused ? 'Iniciar troca automática' : 'Pausar troca automática');
    bannerAutoplay.title = bannerPaused ? 'Iniciar troca automática' : 'Pausar troca automática';
    if (!bannerPaused) bannerTimer = window.setInterval(() => showBanner(activeBanner + 1), 5000);
}

bannerDots.forEach(dot => {
    dot.addEventListener('click', () => {
        showBanner(Number(dot.dataset.bannerIndex));
        if (!bannerPaused) updateBannerTimer();
    });
});

bannerAutoplay.addEventListener('click', () => {
    bannerPaused = !bannerPaused;
    updateBannerTimer();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearInterval(bannerTimer);
    else updateBannerTimer();
});

updateBannerTimer();
