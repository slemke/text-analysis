const app = {
    nlp: window.nlp,
    stopwords: [
        "a", "about", "above", "across", "after", "again", "against", "all", "almost", "alone",
        "along", "already", "also", "although", "always", "among", "an", "and", "another", "any",
        "anybody", "anyone", "anything", "anywhere", "are", "area", "areas", "around", "as", "ask",
        "asked", "asking", "asks", "at", "away", "b", "back", "backed", "backing", "backs", "be",
        "became", "because", "become", "becomes", "been", "before", "began", "behind", "being", "beings", "best",
        "better", "between", "big", "both", "but", "by", "c", "came", "can", "cannot", "case",
        "cases", "certain", "certainly", "clear", "clearly", "come", "could", "d", "did", "differ", "different", "differently",
        "do", "does", "done", "down", "down", "downed", "downing", "downs", "during", "e",
        "each", "early", "either", "end", "ended", "ending", "ends", "enough", "even", "evenly", "ever", "every", "everybody", "everyone",
        "everything", "everywhere", "f", "face", "faces", "fact", "facts", "far", "felt", "few", "find", "finds", "first",
        "for", "four", "from", "full", "fully", "further", "furthered", "furthering", "furthers", "g", "gave",
        "general", "generally", "get", "gets", "give", "given", "gives", "go", "going", "good", "goods", "got", "great",
        "greater", "greatest", "group", "grouped", "grouping", "groups", "h", "had", "has", "have", "having", "he", "her",
        "here", "herself", "high", "high", "high", "higher", "highest", "him", "himself", "his", "how", "however", "i", "if",
        "important", "in", "interest", "interested", "interesting", "interests", "into", "is", "it", "its", "itself", "j", "just", "k",
        "keep", "keeps", "kind", "knew", "know", "known", "knows", "l", "large", "largely", "last", "later", "latest", "least", "less",
        "let", "lets", "like", "likely", "long", "longer", "longest", "m", "made", "make", "making", "man", "many", "may", "me",
        "member", "members", "men", "might", "more", "most", "mostly", "mr", "mrs", "much", "must", "my", "myself", "n",
        "necessary", "need", "needed", "needing", "needs", "never", "new", "new", "newer", "newest", "next", "no", "nobody", "non",
        "noone", "not", "nothing", "now", "nowhere", "number", "numbers", "o", "of", "off", "often", "old", "older",
        "oldest", "on", "once", "one", "only", "open", "opened", "opening", "opens", "or", "order", "ordered", "ordering", "orders",
        "other", "others", "our", "out", "over", "p", "part", "parted", "parting", "parts", "per", "perhaps", "place",
        "places", "point", "pointed", "pointing", "points", "possible", "present", "presented", "presenting", "presents", "problem", 
        "problems", "put", "puts", "q", "quite", "r", "rather", "really", "right", "right", "room", "rooms", "s", "said", "same",
        "saw", "say", "says", "second", "seconds", "see", "seem", "seemed", "seeming", "seems", "sees",
        "several", "shall", "she", "should", "show", "showed", "showing", "shows", "side", "sides", "since", "small", "smaller", "smallest",
        "so", "some", "somebody", "someone", "something", "somewhere", "state", "states", "still", "such", "sure", "t", "take",
        "taken", "than", "that", "the", "their", "them", "then", "there", "therefore", "these", "they", "thing",
        "things", "think", "thinks", "this", "those", "though", "thought", "thoughts", "three", "through", "thus", "to",
        "today", "together", "too", "took", "toward", "turn", "turned", "turning", "turns", "two", "u", "under", "until",
        "up", "upon", "us", "use", "used", "uses", "v", "very", "w", "want", "wanted", "wanting",
        "wants", "was", "way", "ways", "we", "well", "wells", "went", "were", "what", "when", "where", "whether", "which", "while",
        "who", "whole", "whose", "why", "will", "with", "within", "without", "work", "worked", "working", "works", "would", "x", 
        "y", "year", "years", "yet", "you", "young", "younger", "youngest", "your", "yours", "z"
    ],
    text: '',
    mode: null,
    sentences: [],
    tokens: [],
    terms: [],
    dom: [],
    punctuation: ['.', ',', ':', ';', '!', '?'],
    init() {
        document.execCommand('defaultParagraphSeparator', false, 'p');
        this.text = this.getDocument();
        this.update();
    },
    update() {
        this.text = this.getDocument();
        this.tokens = this.nlp(this.text).sentences().terms().out('array');
        this.sentences = this.nlp(this.text).sentences().out('array');
        this.terms = this.nlp(this.text).terms().data();
        let stats = {
            'overall-words': this.getNumberOfWords(this.tokens),
            'overall-punctuation': this.getNumberOfPunctuationMarks(),
            'overall-stopwords': this.getNumberOfStopwords(),
            'vocabulary': this.getVocabulary(this.tokens),
            'average-words': this.getAverageNumberOfWordsPerSentence(),
            'average-punctuation': this.getAverageNumberOfPunctuationPerSentence(),
            'average-stopwords': this.getAverageNumberOfStopwordsPerSentence()
        };
        this.setStats(stats);
        this.setTop5POSTags();
        if(this.mode !== null) {
            this.highlightStopwords();
        }
    },
    getVocabulary(tokens) {
        const uniqueTokens = [...new Set(tokens)];
        return uniqueTokens.length;
    },
    getDocument() {
        return document.querySelector('.analytics__input').textContent || '';
    },
    highlight() {
        if(this.mode !== null) {
            const paragraphs = document.querySelectorAll('.analytics__input p');
            for(const paragraph of paragraphs) {
                paragraph.innerHTML = paragraph.textContent;
            }
            const inputField = document.getElementById('text');
            inputField.contentEditable = true;
            this.mode = null;
            return;
        } else {
            this.highlightStopwords();
        }
    },
    highlightStopwords() {
        const inputField = document.getElementById('text');
        inputField.contentEditable = false;
        const paragraphs = document.querySelectorAll('.analytics__input p');
        for(const paragraph of paragraphs) {
            const words = paragraph.textContent.split(' ');
            const text = words.map((word) => {
                if(this.stopwords.includes(word.toLowerCase())) {
                    return `<span class="stopword">${word}</span>`;
                }
                return word;
            }).join(' ');
            
            paragraph.innerHTML = text;
        }
        this.mode = 'stopwords';
    },
    setText(id, value) {
        let node = document.getElementById(id);
        node.textContent = value;
    },
    getNumberOfStopwords() {
        let counter = 0;
        for(let token of this.tokens) {
            if(this.stopwords.includes(token)) {
                counter += 1;
            }
        }
        return counter;
    },
    getNumberOfWords(tokens) {
        return tokens.length;
    },
    getNumberOfPunctuationMarks() {
        let counter = 0;
        for(let character of this.text) {
            if(this.punctuation.includes(character)) {
                counter += 1;
            }
        }
        return counter;
    },
    getAverageNumberOfWordsPerSentence() {
        let sentences = this.sentences.map(sentence => this.nlp(sentence).terms().length);
        if(sentences.length !== 0) {
            return sentences.reduce((acc, value, index, src) => {
                if(index + 1 == src.length) {
                    return this.roundFloat(acc / src.length);
                } else {
                    return acc += value;
                }
            })
        } else {
            return 0;
        }
    },
    getAverageNumberOfPunctuationPerSentence() {
        return this.roundFloat( this.getNumberOfPunctuationMarks() / this.sentences.length);
    },
    getAverageNumberOfStopwordsPerSentence() {
        return this.roundFloat(this.getNumberOfStopwords() / this.sentences.length);
    },
    getTop5PartOfSpeechTags() {
        let posMap = {};
        const defaultValues = [
            { tag: 'Noun', value: 0 },
            { tag: 'Verb', value: 0 },
            { tag: 'Adjective', value: 0 },
            { tag: 'Adverb', value: 0 },
            { tag: 'Preposition', value: 0 }
        ];

        if(this.terms.length == 0) {
            return defaultValues;
        }

        for(const term of this.terms) {
            if(posMap.hasOwnProperty(term.bestTag)) {
                posMap[term.bestTag] = posMap[term.bestTag] + 1;
            } else {
                posMap[term.bestTag] = 1;
            }
        }
        
        let keys = Object.keys(posMap).sort((a, b) => posMap[b] - posMap[a]);
        const top5 = keys.map((tag) => {
            return { tag, value: posMap[tag] };
        }).slice(0, 5);

        return this.mergeTags(top5, defaultValues).slice(0, 5);
    },
    mergeTags(tags1, tags2) {
        const tags = tags1.map(value => value.tag);
        for(let value of tags2) {
            if(!tags.includes(value.tag)) {
                tags1.push({ tag: value.tag, value: 0});
            }
        }
        return tags1;
    },
    setTop5POSTags() {
        const tags = this.getTop5PartOfSpeechTags();
        const tagIDs = ['pos-tag-1', 'pos-tag-2', 'pos-tag-3', 'pos-tag-4', 'pos-tag-5'];
        const valueIDs = ['pos-value-1', 'pos-value-2', 'pos-value-3', 'pos-value-4', 'pos-value-5'];
        for(let i = 0; i < tags.length; i++) {
            this.setText(tagIDs[i], tags[i].tag);
            this.setText(valueIDs[i], tags[i].value);
        }
    },
    setStats(stats) {
        for(let key in stats) {
            this.setText(key, stats[key]);
        }
    },
    roundFloat(value) {
        const result = Math.round(value * 10) / 10;
        if(isNaN(result)) {
            return 0;
        }
        return result;
    }
};

// load app and listen to new input
app.init();
const text = document.getElementById('text');
text.addEventListener('input', () => {
    setTimeout(() => {
        app.update();
    }, 500);
});

const stopwordsButton = document.getElementById('toolbar__stopwords');
const inputField = document.getElementById('text');

stopwordsButton.addEventListener('click', () => {
    inputField.classList.toggle('inactive');
    stopwordsButton.classList.toggle('active');
    app.highlight();
});