/* ============================================================
   Fistball Live — languages (English, Español, Deutsch, Português)
   t("English text", { var }) returns the text in the chosen language,
   falling back to English. Static HTML uses data-i18n / data-i18n-ph /
   data-i18n-aria / data-i18n-title attributes.
   ============================================================ */
(function () {
  const LANGS = [
    { code: "en", label: "EN", name: "English", locale: "en-GB" },
    { code: "es", label: "ES", name: "Español", locale: "es-ES" },
    { code: "de", label: "DE", name: "Deutsch", locale: "de-DE" },
    { code: "pt", label: "PT", name: "Português", locale: "pt-BR" },
  ];

  const D = {
    es: {
      // tabs & header
      "Standings": "Clasificación", "Bracket": "Cuadro", "Matches": "Partidos", "Schedule": "Calendario",
      "Referees": "Árbitros", "Ranking": "Ranking", "Cards": "Tarjetas", "Uniforms": "Uniformes",
      "Training": "Entrenamiento", "Venue Map": "Mapa del lugar", "More tabs": "Más pestañas",
      "Refresh": "Actualizar", "Install": "Instalar", "Language": "Idioma", "Event": "Evento", "Events": "Eventos", "Categories": "Categorías",
      "Search your team…": "Busca tu equipo…", "Search team": "Buscar equipo",
      "Search team or referee…": "Buscar equipo o árbitro…", "Search team or referee": "Buscar equipo o árbitro",
      "Search by game # or team…": "Buscar por nº de partido o equipo…", "Search games": "Buscar partidos",
      "Loading results…": "Cargando resultados…",
      "Data updates live from the official scoring sheet. Standings are computed from completed group-stage matches.":
        "Los datos se actualizan en vivo desde la planilla oficial. La clasificación se calcula con los partidos terminados de la fase de grupos.",
      "Welcome to Fistball Live": "Bienvenido a Fistball Live",
      "Install the app for one-tap access to live scores, standings, bracket and cards.":
        "Instala la app para ver con un toque resultados en vivo, clasificación, cuadro y tarjetas.",
      "Install App": "Instalar app", "Maybe later": "Quizás más tarde",
      "Tap the <b>Share</b> button, then <b>“Add to Home Screen”</b> to install.":
        "Toca el botón <b>Compartir</b> y luego <b>“Añadir a pantalla de inicio”</b> para instalar.",
      "New version available": "Nueva versión disponible", "Update": "Actualizar",
      "Not started": "Sin comenzar", "Updated {time}": "Actualizado {time}", "Event starts in": "El evento comienza en",
      "Couldn't reach the live sheet — showing the last data loaded. Pull to refresh when back online.":
        "No se pudo acceder a los datos en vivo — se muestran los últimos cargados. Actualiza cuando vuelvas a tener conexión.",
      // standings
      "Team": "Equipo", "M": "PJ", "W": "G", "D": "E", "L": "P", "Sets": "Sets", "Pts": "Pts", "Points": "Puntos",
      "Group standings": "Clasificación del grupo", "Group {g}": "Grupo {g}", "Places 7–9 ranking": "Clasificación puestos 7–9",
      "No matches completed yet — standings will fill in as results come in.":
        "Aún no hay partidos terminados — la clasificación se completará con los resultados.",
      "This category is a knock-out stage — no group table.<br>See the <b>Bracket</b> tab.":
        "Esta categoría es eliminación directa — no hay tabla de grupo.<br>Mira la pestaña <b>Cuadro</b>.",
      "No data for this category yet — check the <b>Matches</b> tab.":
        "Aún no hay datos para esta categoría — mira la pestaña <b>Partidos</b>.",
      "Head-to-head": "Enfrentamientos directos", "sets": "sets", "points": "puntos", "Live": "En vivo",
      // bracket
      "Quarterfinals": "Cuartos de final", "Semifinals": "Semifinales", "Final": "Final", "Gold": "Oro", "Bronze": "Bronce",
      "Repechage": "Repesca", "Intermediate round": "Ronda intermedia", "Places {a}–{b}": "Puestos {a}–{b}", "Place {n}": "Puesto {n}",
      "No knockout stage for this category.<br>Check <b>Standings</b> or <b>Matches</b>.":
        "Esta categoría no tiene eliminación directa.<br>Mira <b>Clasificación</b> o <b>Partidos</b>.",
      // matches
      "All": "Todos", "Finished": "Finalizados", "Upcoming": "Próximos", "No matches to show for this filter.": "No hay partidos para este filtro.",
      "Court {c}": "Cancha {c}", "Current set": "Set actual", "Point by point ›": "Punto a punto ›", "vs": "vs",
      // schedule
      "No matches for “{q}”.": "No hay partidos para “{q}”.", "No matches scheduled yet.": "Aún no hay partidos programados.",
      "1 game": "1 partido", "{n} games": "{n} partidos", "played": "jugados", "Forecast": "Pronóstico", "Ceremony": "Ceremonia",
      // uniforms
      "Uniform {n}": "Uniforme {n}", "No uniforms for “{q}”.": "No hay uniformes para “{q}”.",
      "Uniforms haven't been assigned yet.": "Aún no se asignaron los uniformes.",
      // referees
      "Nothing for “{q}”.": "Nada para “{q}”.", "All games have been played.": "Ya se jugaron todos los partidos.",
      "No referees assigned yet.": "Aún no hay árbitros asignados.", "now": "ahora", "Best of {n}": "Al mejor de {n}",
      "to be confirmed": "a confirmar",
      // ranking
      "Women": "Femenino", "Men": "Masculino", "Other": "Otras", "Final ranking": "Clasificación final", "provisional": "provisoria",
      "The final ranking appears here once a category's final has been played.":
        "La clasificación final aparece aquí cuando se haya jugado la final de una categoría.",
      // training & venue
      "No training times published yet.": "Aún no se publicaron horarios de entrenamiento.",
      "Tap <b>Book</b> on a free time and enter your team name.": "Toca <b>Reservar</b> en un horario libre e ingresa el nombre de tu equipo.",
      "Free": "Libre", "Book": "Reservar", "Book {slot}": "Reservar {slot}", "Team name:": "Nombre del equipo:",
      "Sorry — this time was just booked by another team. Please pick another one.":
        "Lo sentimos — otro equipo acaba de reservar este horario. Elige otro, por favor.",
      "No venue map published yet.": "Aún no se publicó el mapa del lugar.", "Open venue map (PDF) ↗": "Abrir mapa del lugar (PDF) ↗",
      "Venue map": "Mapa del lugar", "Tap the map to open it full size and zoom.": "Toca el mapa para abrirlo en tamaño completo y hacer zoom.",
      "Show more tabs": "Mostrar más pestañas", "Hide the extra tabs": "Ocultar las pestañas extra", "Show all": "Mostrar todas",
      "By car": "En auto", "Public transport": "Transporte público",
      // cards
      "No cautions recorded yet — cards will appear here as referees log them.":
        "Aún no hay tarjetas — aparecerán aquí a medida que los árbitros las registren.",
      "game {n}": "partido {n}",
      // game page
      "Loading…": "Cargando…", "Game not found.": "Partido no encontrado.", "Team A": "Equipo A", "Team B": "Equipo B",
      "Set {n}": "Set {n}", "Game {n}": "Partido {n}", "SETS": "SETS", "{n}. Set": "Set {n}",
      "Point by point": "Punto a punto", "No points yet.": "Aún no hay puntos.",
      "Scoreboard overlay (OBS/vMix):": "Marcador para transmisión (OBS/vMix):", "Data (JSON):": "Datos (JSON):",
      "Open a game from Fistball Live.": "Abre un partido desde Fistball Live.", "Game unavailable.": "Partido no disponible.",
    },
    de: {
      "Standings": "Tabelle", "Bracket": "Turnierbaum", "Matches": "Spiele", "Schedule": "Spielplan",
      "Referees": "Schiedsrichter", "Ranking": "Endstand", "Cards": "Karten", "Uniforms": "Trikots",
      "Training": "Training", "Venue Map": "Lageplan", "More tabs": "Weitere Tabs",
      "Refresh": "Aktualisieren", "Install": "Installieren", "Language": "Sprache", "Event": "Veranstaltung", "Events": "Veranstaltungen", "Categories": "Kategorien",
      "Search your team…": "Dein Team suchen…", "Search team": "Team suchen",
      "Search team or referee…": "Team oder Schiedsrichter suchen…", "Search team or referee": "Team oder Schiedsrichter suchen",
      "Search by game # or team…": "Nach Spiel-Nr. oder Team suchen…", "Search games": "Spiele suchen",
      "Loading results…": "Ergebnisse werden geladen…",
      "Data updates live from the official scoring sheet. Standings are computed from completed group-stage matches.":
        "Die Daten kommen live vom offiziellen Spielbericht. Die Tabelle wird aus den beendeten Vorrundenspielen berechnet.",
      "Welcome to Fistball Live": "Willkommen bei Fistball Live",
      "Install the app for one-tap access to live scores, standings, bracket and cards.":
        "Installiere die App für schnellen Zugriff auf Live-Ergebnisse, Tabelle, Turnierbaum und Karten.",
      "Install App": "App installieren", "Maybe later": "Später",
      "Tap the <b>Share</b> button, then <b>“Add to Home Screen”</b> to install.":
        "Tippe auf <b>Teilen</b> und dann auf <b>„Zum Home-Bildschirm“</b>, um zu installieren.",
      "New version available": "Neue Version verfügbar", "Update": "Aktualisieren",
      "Not started": "Noch nicht begonnen", "Updated {time}": "Aktualisiert {time}", "Event starts in": "Die Veranstaltung beginnt in",
      "Couldn't reach the live sheet — showing the last data loaded. Pull to refresh when back online.":
        "Live-Daten nicht erreichbar — es werden die zuletzt geladenen Daten gezeigt. Aktualisiere, sobald du wieder online bist.",
      "Team": "Team", "M": "Sp", "W": "S", "D": "U", "L": "N", "Sets": "Sätze", "Pts": "Pkt", "Points": "Bälle",
      "Group standings": "Gruppentabelle", "Group {g}": "Gruppe {g}", "Places 7–9 ranking": "Tabelle Plätze 7–9",
      "No matches completed yet — standings will fill in as results come in.":
        "Noch keine Spiele beendet — die Tabelle füllt sich mit den Ergebnissen.",
      "This category is a knock-out stage — no group table.<br>See the <b>Bracket</b> tab.":
        "Diese Kategorie wird im K.-o.-System gespielt — keine Gruppentabelle.<br>Siehe Tab <b>Turnierbaum</b>.",
      "No data for this category yet — check the <b>Matches</b> tab.":
        "Noch keine Daten für diese Kategorie — siehe Tab <b>Spiele</b>.",
      "Head-to-head": "Direkter Vergleich", "sets": "Sätze", "points": "Bälle", "Live": "Live",
      "Quarterfinals": "Viertelfinale", "Semifinals": "Halbfinale", "Final": "Finale", "Gold": "Gold", "Bronze": "Bronze",
      "Repechage": "Hoffnungsrunde", "Intermediate round": "Zwischenrunde", "Places {a}–{b}": "Plätze {a}–{b}", "Place {n}": "Platz {n}",
      "No knockout stage for this category.<br>Check <b>Standings</b> or <b>Matches</b>.":
        "Keine K.-o.-Runde in dieser Kategorie.<br>Siehe <b>Tabelle</b> oder <b>Spiele</b>.",
      "All": "Alle", "Finished": "Beendet", "Upcoming": "Kommend", "No matches to show for this filter.": "Keine Spiele für diesen Filter.",
      "Court {c}": "Feld {c}", "Current set": "Aktueller Satz", "Point by point ›": "Ball für Ball ›", "vs": "–",
      "No matches for “{q}”.": "Keine Spiele für „{q}“.", "No matches scheduled yet.": "Noch keine Spiele angesetzt.",
      "1 game": "1 Spiel", "{n} games": "{n} Spiele", "played": "gespielt", "Forecast": "Wetter", "Ceremony": "Zeremonie",
      "Uniform {n}": "Trikot {n}", "No uniforms for “{q}”.": "Keine Trikots für „{q}“.",
      "Uniforms haven't been assigned yet.": "Die Trikots sind noch nicht zugeteilt.",
      "Nothing for “{q}”.": "Nichts für „{q}“.", "All games have been played.": "Alle Spiele sind gespielt.",
      "No referees assigned yet.": "Noch keine Schiedsrichter eingeteilt.", "now": "jetzt", "Best of {n}": "Best of {n}",
      "to be confirmed": "wird noch bestätigt",
      "Women": "Frauen", "Men": "Männer", "Other": "Weitere", "Final ranking": "Endstand", "provisional": "vorläufig",
      "The final ranking appears here once a category's final has been played.":
        "Der Endstand erscheint hier, sobald das Finale einer Kategorie gespielt ist.",
      "No training times published yet.": "Noch keine Trainingszeiten veröffentlicht.",
      "Tap <b>Book</b> on a free time and enter your team name.": "Tippe bei einer freien Zeit auf <b>Buchen</b> und gib deinen Teamnamen ein.",
      "Free": "Frei", "Book": "Buchen", "Book {slot}": "{slot} buchen", "Team name:": "Teamname:",
      "Sorry — this time was just booked by another team. Please pick another one.":
        "Leider wurde diese Zeit gerade von einem anderen Team gebucht. Bitte wähle eine andere.",
      "No venue map published yet.": "Noch kein Lageplan veröffentlicht.", "Open venue map (PDF) ↗": "Lageplan öffnen (PDF) ↗",
      "Venue map": "Lageplan", "Tap the map to open it full size and zoom.": "Tippe auf den Plan, um ihn groß zu öffnen und zu zoomen.",
      "Show more tabs": "Weitere Tabs zeigen", "Hide the extra tabs": "Zusätzliche Tabs ausblenden", "Show all": "Alle zeigen",
      "By car": "Mit dem Auto", "Public transport": "Öffentliche Verkehrsmittel",
      "No cautions recorded yet — cards will appear here as referees log them.":
        "Noch keine Karten — sie erscheinen hier, sobald die Schiedsrichter sie eintragen.",
      "game {n}": "Spiel {n}",
      "Loading…": "Wird geladen…", "Game not found.": "Spiel nicht gefunden.", "Team A": "Team A", "Team B": "Team B",
      "Set {n}": "Satz {n}", "Game {n}": "Spiel {n}", "SETS": "SÄTZE", "{n}. Set": "{n}. Satz",
      "Point by point": "Ball für Ball", "No points yet.": "Noch keine Punkte.",
      "Scoreboard overlay (OBS/vMix):": "Anzeigetafel für Streams (OBS/vMix):", "Data (JSON):": "Daten (JSON):",
      "Open a game from Fistball Live.": "Öffne ein Spiel in Fistball Live.", "Game unavailable.": "Spiel nicht verfügbar.",
    },
    pt: {
      "Standings": "Classificação", "Bracket": "Chave", "Matches": "Jogos", "Schedule": "Programação",
      "Referees": "Árbitros", "Ranking": "Ranking", "Cards": "Cartões", "Uniforms": "Uniformes",
      "Training": "Treinos", "Venue Map": "Mapa do local", "More tabs": "Mais abas",
      "Refresh": "Atualizar", "Install": "Instalar", "Language": "Idioma", "Event": "Evento", "Events": "Eventos", "Categories": "Categorias",
      "Search your team…": "Busque sua equipe…", "Search team": "Buscar equipe",
      "Search team or referee…": "Buscar equipe ou árbitro…", "Search team or referee": "Buscar equipe ou árbitro",
      "Search by game # or team…": "Buscar por nº do jogo ou equipe…", "Search games": "Buscar jogos",
      "Loading results…": "Carregando resultados…",
      "Data updates live from the official scoring sheet. Standings are computed from completed group-stage matches.":
        "Os dados são atualizados ao vivo pela súmula oficial. A classificação é calculada com os jogos encerrados da fase de grupos.",
      "Welcome to Fistball Live": "Bem-vindo ao Fistball Live",
      "Install the app for one-tap access to live scores, standings, bracket and cards.":
        "Instale o app para ver com um toque placares ao vivo, classificação, chave e cartões.",
      "Install App": "Instalar app", "Maybe later": "Agora não",
      "Tap the <b>Share</b> button, then <b>“Add to Home Screen”</b> to install.":
        "Toque em <b>Compartilhar</b> e depois em <b>“Adicionar à Tela de Início”</b> para instalar.",
      "New version available": "Nova versão disponível", "Update": "Atualizar",
      "Not started": "Não iniciado", "Updated {time}": "Atualizado {time}", "Event starts in": "O evento começa em",
      "Couldn't reach the live sheet — showing the last data loaded. Pull to refresh when back online.":
        "Não foi possível acessar os dados ao vivo — mostrando os últimos carregados. Atualize quando voltar a ter conexão.",
      "Team": "Equipe", "M": "J", "W": "V", "D": "E", "L": "D", "Sets": "Sets", "Pts": "Pts", "Points": "Pontos",
      "Group standings": "Classificação do grupo", "Group {g}": "Grupo {g}", "Places 7–9 ranking": "Classificação 7º–9º",
      "No matches completed yet — standings will fill in as results come in.":
        "Ainda não há jogos encerrados — a classificação será preenchida com os resultados.",
      "This category is a knock-out stage — no group table.<br>See the <b>Bracket</b> tab.":
        "Esta categoria é mata-mata — não há tabela de grupo.<br>Veja a aba <b>Chave</b>.",
      "No data for this category yet — check the <b>Matches</b> tab.":
        "Ainda não há dados para esta categoria — veja a aba <b>Jogos</b>.",
      "Head-to-head": "Confronto direto", "sets": "sets", "points": "pontos", "Live": "Ao vivo",
      "Quarterfinals": "Quartas de final", "Semifinals": "Semifinais", "Final": "Final", "Gold": "Ouro", "Bronze": "Bronze",
      "Repechage": "Repescagem", "Intermediate round": "Fase intermediária", "Places {a}–{b}": "Colocação {a}–{b}", "Place {n}": "{n}º lugar",
      "No knockout stage for this category.<br>Check <b>Standings</b> or <b>Matches</b>.":
        "Esta categoria não tem mata-mata.<br>Veja <b>Classificação</b> ou <b>Jogos</b>.",
      "All": "Todos", "Finished": "Encerrados", "Upcoming": "Próximos", "No matches to show for this filter.": "Nenhum jogo para este filtro.",
      "Court {c}": "Quadra {c}", "Current set": "Set atual", "Point by point ›": "Ponto a ponto ›", "vs": "x",
      "No matches for “{q}”.": "Nenhum jogo para “{q}”.", "No matches scheduled yet.": "Ainda não há jogos programados.",
      "1 game": "1 jogo", "{n} games": "{n} jogos", "played": "disputados", "Forecast": "Previsão", "Ceremony": "Cerimônia",
      "Uniform {n}": "Uniforme {n}", "No uniforms for “{q}”.": "Nenhum uniforme para “{q}”.",
      "Uniforms haven't been assigned yet.": "Os uniformes ainda não foram definidos.",
      "Nothing for “{q}”.": "Nada para “{q}”.", "All games have been played.": "Todos os jogos já foram disputados.",
      "No referees assigned yet.": "Ainda não há árbitros escalados.", "now": "agora", "Best of {n}": "Melhor de {n}",
      "to be confirmed": "a confirmar",
      "Women": "Feminino", "Men": "Masculino", "Other": "Outras", "Final ranking": "Classificação final", "provisional": "provisória",
      "The final ranking appears here once a category's final has been played.":
        "A classificação final aparece aqui quando a final de uma categoria for disputada.",
      "No training times published yet.": "Ainda não há horários de treino publicados.",
      "Tap <b>Book</b> on a free time and enter your team name.": "Toque em <b>Reservar</b> num horário livre e digite o nome da sua equipe.",
      "Free": "Livre", "Book": "Reservar", "Book {slot}": "Reservar {slot}", "Team name:": "Nome da equipe:",
      "Sorry — this time was just booked by another team. Please pick another one.":
        "Desculpe — outra equipe acabou de reservar este horário. Escolha outro, por favor.",
      "No venue map published yet.": "Ainda não há mapa do local publicado.", "Open venue map (PDF) ↗": "Abrir mapa do local (PDF) ↗",
      "Venue map": "Mapa do local", "Tap the map to open it full size and zoom.": "Toque no mapa para abrir em tamanho cheio e dar zoom.",
      "Show more tabs": "Mostrar mais abas", "Hide the extra tabs": "Esconder as abas extras", "Show all": "Mostrar todas",
      "By car": "De carro", "Public transport": "Transporte público",
      "No cautions recorded yet — cards will appear here as referees log them.":
        "Ainda não há cartões — eles aparecem aqui conforme os árbitros registram.",
      "game {n}": "jogo {n}",
      "Loading…": "Carregando…", "Game not found.": "Jogo não encontrado.", "Team A": "Equipe A", "Team B": "Equipe B",
      "Set {n}": "Set {n}", "Game {n}": "Jogo {n}", "SETS": "SETS", "{n}. Set": "{n}º set",
      "Point by point": "Ponto a ponto", "No points yet.": "Ainda não há pontos.",
      "Scoreboard overlay (OBS/vMix):": "Placar para transmissão (OBS/vMix):", "Data (JSON):": "Dados (JSON):",
      "Open a game from Fistball Live.": "Abra um jogo pelo Fistball Live.", "Game unavailable.": "Jogo indisponível.",
    },
  };

  // Words in round names and bracket slot labels that come from the data.
  const ROUND = {
    es: { qr: "Fase de clasificación", sf: "Semifinal", qf: "Cuartos de final", bronze: "Partido por el bronce", gold: "Partido por el oro", final: "Final", place: "Puestos", win: "Ganador", lose: "Perdedor", group: "Grupo", ord: (n) => `${n}º` },
    de: { qr: "Vorrunde", sf: "Halbfinale", qf: "Viertelfinale", bronze: "Spiel um Bronze", gold: "Spiel um Gold", final: "Finale", place: "Platz", win: "Sieger", lose: "Verlierer", group: "Gruppe", ord: (n) => `${n}.` },
    pt: { qr: "Fase de classificação", sf: "Semifinal", qf: "Quartas de final", bronze: "Disputa do bronze", gold: "Disputa do ouro", final: "Final", place: "Colocação", win: "Vencedor", lose: "Perdedor", group: "Grupo", ord: (n) => `${n}º` },
  };
  const STATUS = {
    es: { "Not Started": "No iniciado", "Starting": "Comenzando", "In progress": "En juego", "Finished": "Finalizado" },
    de: { "Not Started": "Nicht begonnen", "Starting": "Beginnt", "In progress": "Läuft", "Finished": "Beendet" },
    pt: { "Not Started": "Não iniciado", "Starting": "Começando", "In progress": "Em andamento", "Finished": "Encerrado" },
  };

  const pick = () => {
    try { const s = localStorage.getItem("fb_lang"); if (s && LANGS.some((l) => l.code === s)) return s; } catch (_) {}
    for (const n of navigator.languages || [navigator.language || "en"]) {
      const c = String(n).slice(0, 2).toLowerCase();
      if (LANGS.some((l) => l.code === c)) return c;
    }
    return "en";
  };
  let lang = pick();

  const fill = (s, v) => (v ? String(s).replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m)) : s);
  function t(en, vars) { return fill((D[lang] && D[lang][en]) || en, vars); }

  function tRound(round) {
    const R = ROUND[lang];
    const s = String(round || "");
    if (!R || !s) return s;
    let m;
    if (/^\s*(qualification round|vorrunde|preliminary round)\s*$/i.test(s)) return R.qr;
    if ((m = s.match(/^\s*semi-?finals?\s*(\d*)\s*$/i))) return `${R.sf}${m[1] ? " " + m[1] : ""}`;
    if ((m = s.match(/^\s*quarter-?finals?\s*(\d*)\s*$/i))) return `${R.qf}${m[1] ? " " + m[1] : ""}`;
    if (/^\s*bronze medal match\s*$/i.test(s)) return R.bronze;
    if (/^\s*gold medal match\s*$/i.test(s)) return R.gold;
    if (/^\s*finale?\s*$/i.test(s)) return R.final;
    if ((m = s.match(/^\s*placement\s*(\d+)\s*[-–]\s*(\d+)\s*$/i))) return `${R.place} ${m[1]}–${m[2]}`;
    if ((m = s.match(/^\s*group\s+(\w+)\s*$/i))) return `${R.group} ${m[1]}`;
    return s;
  }
  // Bracket placeholders: "Winner Semifinal 1", "Loser QF2", "1st Group A".
  function tSlot(name) {
    const R = ROUND[lang];
    const s = String(name || "");
    if (!R || !s) return s;
    let m;
    if ((m = s.match(/^\s*(winner|loser)\s+(?:of\s+)?(.+)$/i))) return `${/^w/i.test(m[1]) ? R.win : R.lose} ${tRound(m[2])}`;
    if ((m = s.match(/^\s*(\d+)(?:st|nd|rd|th)\s+(.+)$/i))) return `${R.ord(m[1])} ${tRound(m[2])}`;
    return s;
  }
  function tStatus(s) { return (STATUS[lang] && STATUS[lang][s]) || s; }
  function locale() { return (LANGS.find((l) => l.code === lang) || LANGS[0]).locale; }

  function applyStatic(root) {
    const r = root || document;
    r.querySelectorAll("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    r.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    r.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    r.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    document.documentElement.lang = lang;
  }
  // A <select> language picker; onChange runs after the switch (re-render).
  function mountPicker(el, onChange) {
    if (!el) return;
    el.innerHTML = LANGS.map((l) => `<option value="${l.code}" ${l.code === lang ? "selected" : ""}>${l.label}</option>`).join("");
    el.title = t("Language");
    el.setAttribute("aria-label", t("Language"));
    el.onchange = () => {
      lang = el.value;
      try { localStorage.setItem("fb_lang", lang); } catch (_) {}
      applyStatic();
      el.title = t("Language"); el.setAttribute("aria-label", t("Language"));
      if (onChange) onChange(lang);
    };
  }

  window.I18N = { LANGS, t, tRound, tSlot, tStatus, locale, applyStatic, mountPicker, get lang() { return lang; } };
  window.t = t;
})();
