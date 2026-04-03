let currentQuestion = 1;
let score = 0;
const totalQuestions = 3;
// Aici treci mereu numărul total de lecții când adaugi una nouă pentru grupa 1
// Definere număr lecții pe grupe
const lectiiGrupa1 = 9; // Câte vrei să ai la final în prima grupă
const lectiiGrupa2 = 10;
const lectiiGrupa3 = 10;
const lectiiGrupa4 = 10;

// Calculatorul adună automat totalul pentru bara globală
const totalSiteLessons = lectiiGrupa1 + lectiiGrupa2 + lectiiGrupa3 + lectiiGrupa4;

// Iar pentru bara din interiorul Grupei 1, folosim variabila specifică:
const totalLessons = lectiiGrupa1;

function checkAnswer(button, isCorrect) {
    // Dezactivăm butoanele după ce s-a ales un răspuns
    let parent = button.parentElement;
    let buttons = parent.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        button.classList.add('correct');
        score++;
    } else {
        button.classList.add('incorrect');
    }

    // Așteptăm puțin și trecem la următoarea întrebare
    setTimeout(() => {
        document.getElementById('q' + currentQuestion).style.display = 'none';
        currentQuestion++;

        if (currentQuestion <= totalQuestions) {
            document.getElementById('q' + currentQuestion).style.display = 'block';
        } else {
            showResults();
        }
    }, 1000);
}

function showResults() {
    const resultBox = document.getElementById('result-box');
    const scoreText = document.getElementById('score-text');
    const resultTitle = document.getElementById('result-title');
    const btnRestart = document.getElementById('btn-restart');
    const finishSection = document.getElementById('finish-section');

    resultBox.style.display = 'block';
    scoreText.innerText = `Ai obținut ${score} puncte din ${totalQuestions}!`;

    if (score === totalQuestions) {
        resultTitle.innerText = "🎉 Excelent! Ai răspuns perfect!";
        resultTitle.style.color = "#22c55e"; 
        btnRestart.style.display = "none"; 
        finishSection.style.display = "block"; 
    } else {
        resultTitle.innerText = "Aproape ai reușit!";
        resultTitle.style.color = "#ffd700"; 
        btnRestart.style.display = "inline-block"; 
        finishSection.style.display = "none"; 
    }
}

/* --- Efecte de Scroll --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
        } else {
            entry.target.classList.remove('show-element');
        }
    });
}, {
    threshold: 0.1 
});

const hiddenElements = document.querySelectorAll('.hidden-left, .hidden-right, .hidden-bottom');
hiddenElements.forEach((el) => observer.observe(el));


/* --- Calculare Progres pentru Pagina Grupei --- */


/* --- Funcția de Resetare --- */
/* --- Calculare Progres pentru Pagina Grupei 1 --- */
function updateProgress() {
    let completedLessons = 0;

    for (let i = 1; i <= totalLessons; i++) {
        const card = document.getElementById('card-' + i); 
        
        // AICI ESTE REPARAȚIA 1: Căutăm denumirea corectă ('gr1_l1_complet')
        if (localStorage.getItem('gr1_l' + i + '_complet') === 'true') {
            completedLessons++;
            
            if (card) {
                card.classList.add('completed');
                const link = card.querySelector('.lesson-link');
                
                // AICI ESTE REPARAȚIA 2: Tăiem accesul direct din scriptul central
                if (link) {
                    link.innerHTML = "Terminat! ";
                    link.style.pointerEvents = "none"; // Blochează click-ul
                    link.style.backgroundColor = "#475569"; // Gri închis
                    link.style.color = "#94a3b8";
                }
            }
        }
    }

    let percentage = (completedLessons / totalLessons) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-percentage');
    const congratsMsg = document.getElementById('congrats-message');
    const btnReset = document.getElementById('btn-reset');

    if (progressFill && progressText) {
        progressFill.style.width = percentage + '%';
        progressText.innerText = Math.round(percentage) + '%';

        if (percentage === 100) {
            congratsMsg.style.display = 'block';
        } else {
            congratsMsg.style.display = 'none';
        }

        if (percentage > 0) {
            btnReset.style.display = 'block';
        } else {
            btnReset.style.display = 'none';
        }
    }
}

/* --- Calculare Progres GLOBAL (pentru kredo.html) --- */
function updateGlobalProgress() {
    const globalProgressFill = document.getElementById('global-progress-fill');
    const globalProgressText = document.getElementById('global-progress-percentage');
    
    if (!globalProgressFill || !globalProgressText) return;

    let totalCompleted = 0;

    // AICI ESTE REPARAȚIA 3: Căutăm orice cheie care se termină în '_complet' (va merge și pentru Grupa 2!)
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith('_complet') && localStorage.getItem(key) === 'true') {
            totalCompleted++;
        }
    }

    let globalPercentage = (totalCompleted / totalSiteLessons) * 100;
    if (globalPercentage > 100) globalPercentage = 100;

    globalProgressFill.style.width = globalPercentage + '%';
    globalProgressText.innerText = Math.round(globalPercentage) + '%';

    const globalResetBtn = document.getElementById('btn-global-reset');
    if (globalResetBtn) {
        if (globalPercentage > 0) {
            globalResetBtn.style.display = 'block';
        } else {
            globalResetBtn.style.display = 'none';
        }
    }
}

/* --- Funcția de Resetare GLOBALĂ --- */
function resetGlobalProgress() {
    if (confirm("⚠️ ATENȚIE! Ești sigur că vrei să ștergi progresul de la TOATE grupele? Această acțiune nu poate fi anulată!")) {
        
        let keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // Ștergem absolut toate cheile noastre noi care se termină în '_complet'
            if (key && key.endsWith('_complet')) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(k => localStorage.removeItem(k));
        location.reload();
    }
}

/* --- Funcția de Resetare LOCALĂ (pentru interiorul Grupei 1) --- */
function resetProgress() {
    if (confirm("Ești sigur că vrei să ștergi progresul pentru această grupă?")) {
        for (let i = 1; i <= totalLessons; i++) {
            // Reparat ca să șteargă cheile corecte
            localStorage.removeItem('gr1_l' + i + '_complet');
        }
        location.reload();
    }
}

/* --- Funcția de Finalizare Lecție --- */
function finishLesson(lessonNumber, redirectPath) {
    // Salvăm cu un nume STARDARD: gr1_l1_complet, gr1_l2_complet, etc.
    const key = 'gr1_l' + lessonNumber + '_complet';
    localStorage.setItem(key, 'true');
    
    console.log("Am salvat: " + key); // Verificăm în consolă (F12)

    if (redirectPath) {
        window.location.href = redirectPath;
    }
}

/* --- Versetul Zilei --- */
const bibleVerses = [
    { text: "„Căci El va porunci îngerilor Săi să te păzească în toate căile tale.”", ref: "Psalmul 91:11" },
    { text: "„Pot totul în Hristos, care mă întărește.”", ref: "Filipeni 4:13" },
    { text: "„Domnul este Păstorul meu: nu voi duce lipsă de nimic.”", ref: "Psalmul 23:1" },
    { text: "„Căutați mai întâi Împărăția lui Dumnezeu și neprihănirea Lui.”", ref: "Matei 6:33" },
    { text: "„Bucurați-vă totdeauna în Domnul! Iarăși zic: Bucurați-vă!”", ref: "Filipeni 4:4" },
    { text: "„Cuvântul Tău este o candelă pentru picioarele mele.”", ref: "Psalmul 119:105" },
    { text: "„Domnul este lumina și mântuirea mea: de cine să mă tem?”", ref: "Psalmul 27:1" },
    { text: "„Inima veselă este un bun leac, dar un duh mâhnit usucă oasele.”", ref: "Proverbe 17:22" }
];

function updateDailyVerse() {
    const textElement = document.getElementById('daily-verse-text');
    const refElement = document.getElementById('daily-verse-ref');

    if (!textElement || !refElement) return;

    const now = new Date();
    const dateSeed = now.getFullYear() + now.getMonth() + now.getDate();
    const verseIndex = dateSeed % bibleVerses.length;
    const selectedVerse = bibleVerses[verseIndex];

    textElement.innerText = selectedVerse.text;
    refElement.innerText = selectedVerse.ref;
}

/* --- Calculare Progres GLOBAL (pentru kredo.html) --- */



/* =========================================
   PANOU DE COMANDĂ (Rulează la pornire)
   ========================================= */
function pornesteMotoarele() {
    updateDailyVerse();
    updateProgress();
    updateProgressGrupa2();
    updateGlobalProgress();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pornesteMotoarele);
} else {
    pornesteMotoarele();
}

/* --- Funcția de Resetare GLOBALĂ --- */


/* ================= FUNCȚIE PENTRU FORMULARUL DE CONTACT ================= */
/* ================= FUNCȚIE PENTRU FORMULARUL DE CONTACT (Formspree) ================= */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        // Oprim pagina să dea refresh clasic
        event.preventDefault();

        // Luăm datele din formular
        const data = new FormData(event.target);

        // Trimitem datele către Formspree în fundal (fără să părăsim pagina)
        fetch(event.target.action, {
            method: contactForm.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                // Dacă totul a mers bine, ascundem formularul și arătăm mesajul
                contactForm.style.display = 'none';
                const successMessage = document.getElementById('success-message');
                if (successMessage) {
                    successMessage.style.display = 'block';
                }
                contactForm.reset(); // Curățăm căsuțele
            } else {
                alert("Oops! A apărut o problemă. Te rugăm să încerci din nou.");
            }
        }).catch(error => {
            alert("Eroare de conexiune. Verifică internetul!");
        });
    });
}

/* --- Calculare Progres pentru Grupa 2 (Sistemul Solar) --- */
function updateProgressGrupa2() {
    let completedLessons = 0;
    const totalLectiiG2 = 10; 

    // Verificăm memoria
    for (let i = 1; i <= totalLectiiG2; i++) {
        if (localStorage.getItem('gr2_l' + i + '_complet') === 'true') {
            completedLessons++;
        }
    }

    let percentage = (completedLessons / totalLectiiG2) * 100;

    // Elementele de pe pagină
    const progressFillG2 = document.getElementById('gr2-progress-fill');
    const progressTextG2 = document.getElementById('gr2-percentage');
    const congratsMsgG2 = document.getElementById('gr2-congrats');
    const btnResetG2 = document.getElementById('btn-reset-g2');

    if (progressFillG2 && progressTextG2) {
        progressFillG2.style.width = percentage + '%';
        progressTextG2.innerText = Math.round(percentage) + '%';

        if (congratsMsgG2) {
            congratsMsgG2.style.display = (percentage === 100) ? 'block' : 'none';
        }

        // Arătăm butonul de reset doar dacă există progres
        if (btnResetG2) {
            btnResetG2.style.display = (percentage > 0) ? 'block' : 'none';
        }
    }
}

/* --- Funcția de Resetare pentru Grupa 2 --- */
function resetProgressG2() {
    if (confirm("Comandante, ești sigur că vrei să resetezi explorarea sistemului solar?")) {
        for (let i = 1; i <= 10; i++) {
            localStorage.removeItem('gr2_l' + i + '_complet');
        }
        location.reload();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const tooltip = document.getElementById('universal-tooltip');
    
    // Căutăm toate planetele
    document.querySelectorAll('.planet').forEach(planet => {
        
        planet.addEventListener('mouseenter', function() {
            // Luăm numele lecției (ex: "Lecția 1") din ce scriem noi aici
            // Sau poți folosi un atribut 'data-name' în HTML
            let lessonName = this.getAttribute('data-name') || "Explorare...";
            
            tooltip.innerText = lessonName;
            tooltip.style.display = 'block';
        });

        planet.addEventListener('mousemove', function(e) {
            // Măsurăm exact unde e planeta pe ecran în milisecunda asta
            const rect = this.getBoundingClientRect();
            
            // Poziționăm eticheta fix deasupra centrului planetei
            tooltip.style.left = (rect.left + rect.width / 2) + "px";
            tooltip.style.top = (rect.top - 15) + "px";
        });

        planet.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
    });
});