
const KEY = 'cpWeekendPiaui2026'; const agenda = {
    sat: [['09:00–10:00',
        'Preparação e check-in digital',
        'Organizar ambiente, testar links e conferir avisos',
        'PREPARAÇÃO'],
    ['10:00–11:30',
        'Abertura oficial',
        'Acompanhar a abertura e identificar canais de transmissão',
        'ABERTURA'],
    ['11:30–13:00',
        'Palestra magna de abertura',
        'Registrar ideias centrais e perguntas para aprofundar',
        'PALESTRA'],
    ['13:00–14:00',
        'Pausa para almoço',
        'Desconectar um pouco e descansar',
        'INTERVALO'],
    ['14:00–16:00',
        'Bloco de palestras: IA e educação',
        'Priorizar atividades sobre IA, ensino e futuro da aprendizagem',
        'SUGESTÃO'],
    ['16:00–16:30',
        'Pausa + revisão de insights',
        'Anotar os três aprendizados mais relevantes até aqui',
        'INTERVALO'],
    ['16:30–18:30',
        'Tecnologia e sociedade',
        'Buscar temas de cibersegurança, desenvolvimento e trabalho',
        'SUGESTÃO'],
    ['18:30–19:30',
        'Pausa para jantar',
        'Recarregar as energias',
        'INTERVALO'],
    ['19:30–21:00',
        'Inovação, empreendedorismo e debates',
        'Identificar problemas que poderiam virar produtos digitais',
        'SUGESTÃO'],
    ['21:00–21:30',
        'Fechamento do dia',
        'Resumir aprendizados e escolher prioridades para domingo',
        'REVISÃO']],
    sun: [['09:30–10:30',
        'Revisão do sábado',
        'Revisitar anotações e selecionar temas para aprofundar',
        'PREPARAÇÃO'],
    ['11:00–13:00',
        'Palestras e comunidades',
        'Acompanhar atividades disponíveis e participar dos chats',
        'EVENTO'],
    ['13:00–14:00',
        'Pausa para almoço',
        'Descansar e organizar as próximas atividades',
        'INTERVALO'],
    ['14:00–16:00',
        'Workshops e atividades práticas',
        'Experimentar conceitos, ferramentas e demonstrações',
        'EVENTO'],
    ['16:00–16:30',
        'Pausa + networking',
        'Compartilhar uma descoberta e interagir com participantes',
        'INTERVALO'],
    ['16:30–18:30',
        'Comunidades e aprofundamento',
        'Acompanhar discussões e registrar referências',
        'EVENTO'],
    ['18:30–19:30',
        'Pausa para jantar',
        'Preparar-se para o encerramento',
        'INTERVALO'],
    ['19:30–20:30',
        'Encerramento e premiações',
        'Acompanhar painel final e premiações do Ideathon',
        'ENCERRAMENTO'],
    ['20:30–21:00',
        'Balanço final',
        'Definir um projeto, próximos passos e aprendizados',
        'REVISÃO']]
};
const topics = ['Inteligência Artificial generativa', 'Machine Learning', 'Python', 'Robótica', 'Computação em nuvem', 'Cibersegurança', 'Big Data', 'Análise de dados', 'Startups', 'Empreendedorismo digital', 'Educação tecnológica', 'Internet das Coisas (IoT)', 'Computação quântica', 'Automação', 'Ética em IA', 'Mercado de trabalho tech'];
const missions = ['Assistir a pelo menos 8 palestras ou atividades', 'Registrar 20 aprendizados importantes', 'Conhecer 3 comunidades ou profissionais', 'Completar o bingo tecnológico', 'Selecionar 1 tecnologia para aprofundamento', 'Desenvolver 1 protótipo ou projeto inicial', 'Publicar um resumo no GitHub ou LinkedIn'];
const prompts = ['Como a IA pode tornar o aprendizado mais acessível?', 'Como pequenas empresas podem usar dados para decidir melhor?', 'Como proteger crianças e adolescentes no ambiente digital?', 'Como automatizar uma tarefa repetitiva do cotidiano?', 'Como conectar pessoas que querem aprender programação?', 'Como tornar serviços públicos mais simples com tecnologia?', 'Como detectar notícias falsas usando ferramentas digitais?'];
let data = {}; try {
    data = JSON.parse(localStorage.getItem(KEY)) || {}
} catch (e) { } let day = 'sat';
const $ = id => document.getElementById(id); function save() {
    localStorage.setItem(KEY, JSON.stringify(data)); stats()
} function toast(s) {
    $('toast').textContent = s; $('toast').classList.add('show'); setTimeout(() => $('toast').classList.remove('show'), 2000)
}
function stats() {
    let e = (data.events || []).length,
        b = (data.bingo || []).length,
        g = (data.goals || []).length,
        total = agenda.sat.length + agenda.sun.length; $('sEvents').textContent = e; $('sBingo').textContent = b + '/16'; $('sGoals').textContent = g + '/7'; $('bingoCount').textContent = b + ' / 16'; $('sTotal').textContent = Math.round(e / total * 50 + b / 16 * 20 + g / 7 * 30) + '%'; $('goalPct').textContent = Math.round(g / 7 * 100) + '% CONCLUÍDO'; $('goalBar').style.width = g / 7 * 100 + '%'
}
function renderAgenda() {
    let box = $('events'); box.innerHTML = ''; agenda[day].forEach((x, i) => {
        let id = day + '-' + i, done = (data.events || []).includes(id), row = document.createElement('div'); row.className = 'event' + (done ? ' done' : ''); row.innerHTML = `<div class="time">${x[0]}</div><div><div class="ename">${x[1]}</div><div class="emeta">${x[2]}</div></div><span class="etype">${x[3]}</span><input class="check" type="checkbox" ${done ? 'checked' : ''} aria-label="Concluir atividade">`; row.querySelector('input').onchange = ev => {
            data.events = data.events || []; data.events = ev.target.checked ? [...data.events, id] : data.events.filter(v => v !== id); save(); renderAgenda()
        }; box.append(row)
    }); $('dayNote').textContent = day === 'sat' ? 'FOCO DO DIA · Identificar tecnologias e ideias que possam virar projetos.' : 'FOCO DO DIA · Consolidar aprendizados, conectar-se a comunidades e definir próximos passos.'; document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.day === day))
}
function renderBingo() {
    let box = $('bingo'); box.innerHTML = ''; topics.forEach((t, i) => {
        let b = document.createElement('button'); b.className = 'cell' + ((data.bingo || []).includes(i) ? ' marked' : ''); b.textContent = t; b.onclick = () => {
            data.bingo = data.bingo || []; data.bingo = data.bingo.includes(i) ? data.bingo.filter(x => x !== i) : [...data.bingo, i]; save(); renderBingo()
        }; box.append(b)
    })
}
function renderGoals() {
    let box = $('goals'); box.innerHTML = ''; missions.forEach((m, i) => {
        let l = document.createElement('label'); l.className = 'goal' + ((data.goals || []).includes(i) ? ' done' : ''); l.innerHTML = `<input type="checkbox" ${((data.goals || []).includes(i)) ? 'checked' : ''}><span>${m}</span>`; l.querySelector('input').onchange = e => {
            data.goals = data.goals || []; data.goals = e.target.checked ? [...data.goals, i] : data.goals.filter(x => x !== i); save(); renderGoals()
        }; box.append(l)
    })
}
document.querySelectorAll('.tab').forEach(b => b.onclick = () => {
    day = b.dataset.day; renderAgenda()
});
$('notes').value = data.notes || ''; $('notes').oninput = e => {
    data.notes = e.target.value; save(); $('saveStatus').textContent = 'SALVANDO...'; clearTimeout(window.nt); window.nt = setTimeout(() => $('saveStatus').textContent = 'SALVO LOCALMENTE', 450)
};
$('projectName').value = data.projectName || ''; $('projectName').oninput = e => {
    data.projectName = e.target.value; save()
}; $('projectDesc').value = data.projectDesc || ''; $('projectDesc').oninput = e => {
    data.projectDesc = e.target.value; save()
};
document.querySelectorAll('[data-prep]').forEach(c => {
    c.checked = (data.prep || []).includes(c.dataset.prep); c.onchange = () => {
        data.prep = data.prep || []; data.prep = c.checked ? [...data.prep, c.dataset.prep] : data.prep.filter(x => x !== c.dataset.prep); save()
    }
});
$('newIdea').onclick = () => {
    let p = prompts[Math.floor(Math.random() * prompts.length)]; $('prompt').textContent = p; data.idea = p; save()
}; if (data.idea) $('prompt').textContent = data.idea;
$('copy').onclick = async () => {
    try {
        await navigator.clipboard.writeText($('notes').value); toast('Anotações copiadas!')
    } catch (e) {
        toast('Cópia indisponível neste navegador.')
    }
};
$('resetBingo').onclick = () => {
    if (confirm('Deseja apagar todas as marcações do bingo?')) {
        data.bingo = []; save(); renderBingo(); toast('Bingo reiniciado.')
    }
};
$('export').onclick = () => {
    let blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
    }),
        a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'campus-party-piaui-2026-backup.json'; a.click(); URL.revokeObjectURL(a.href); toast('Backup exportado!')
};
renderAgenda(); renderBingo(); renderGoals(); stats();
