from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

words = [
    "Apple", "Ant", "Angle", "Abandon", "Abstract", "Acclaim", "Agility", "Apex", "Arbitrary", "Axiom",
    "Banana", "Band", "Beacon", "Betray", "Bizarre", "Bliss", "Bold", "Breathe", "Brisk", "Bungle",
    "Cat", "Candid", "Cascade", "Cautious", "Celestial", "Chasm", "Cherry", "Chronology", "Clarity", "Cloak", "Covenant",
    "Dog", "Dabble", "Dauntless", "Debris", "Decree", "Deliberate", "Demise", "Derive", "Dignity", "Dwell",
    "Elephant", "Eager", "Eclipse", "Effort", "Elicit", "Elusive", "Empathy", "Enclave", "Endeavor", "Ethereal",
    "Fox", "Fabricate", "Facet", "Fathom", "Felicity", "Fervor", "Flamboyant", "Flicker", "Flourish", "Frantic",
    "Giraffe", "Gaze", "Glean", "Glimmer", "Gnarled", "Gracious", "Gregarious", "Grieve", "Grumble", "Gush",
    "House", "Haphazard", "Harbinger", "Harmony", "Haste", "Haven", "Heed", "Heritage", "Hollow", "Hypothesis",
    "Ice", "Illuminate", "Illusion", "Immaculate", "Immense", "Imminent", "Impeccable", "Implode", "Incite", "Integrity",
    "Jaguar", "Jab", "Jargon", "Jeopardy", "Jest", "Jubilant", "Junction", "Jurisdiction", "Justice", "Juxtapose",
    "Kangaroo", "Keen", "Kindle", "Knack", "Knight", "Knot", "Kudos", "Kinetic", "Kinship", "Knave",
    "Lion", "Labyrinth", "Lament", "Languish", "Latent", "Lavish", "Legacy", "Lethargy", "Lucid", "Luminous",
    "Monkey", "Magnify", "Malice", "Mandate", "Manifest", "Mingle", "Mirage", "Misconstrue", "Mirth", "Muddle",
    "Nest", "Navigate", "Nebulous", "Negate", "Nimble", "Nocturnal", "Notion", "Nuance", "Nullify", "Nurture",
    "Owl", "Oasis", "Obscure", "Omen", "Omnipotent", "Opulent", "Oscillate", "Outlandish", "Ovation", "Oxymoron",
    "Parrot", "Pacify", "Palpable", "Paradox", "Paragon", "Penchant", "Perceive", "Peril", "Pinnacle", "Pristine",
    "Quail", "Quaint", "Quandary", "Quarantine", "Quell", "Query", "Quest", "Quibble", "Quirk", "Quiver",
    "Rabbit", "Radiate", "Rampant", "Rapture", "Reckon", "Refute", "Relinquish", "Resilient", "Reverberate", "Rivet",
    "Snake", "Sacrifice", "Sanctity", "Savvy", "Scintillate", "Shimmer", "Solace", "Spectrum", "Squalor", "Synergy",
    "Tiger", "Tangible", "Tenacity", "Tenuous", "Tranquil", "Transcend", "Treacherous", "Tribute", "Turbulent", "Twine",
    "Umbrella", "Unanimous", "Uncanny", "Undulate", "Unison", "Untangle", "Usher", "Utilize", "Utopia", "Uplift",
    "Vulture", "Vacant", "Validate", "Vantage", "Vehement", "Venture", "Verdict", "Vibrant", "Vigilant", "Volatile",
    "Whale", "Wander", "Wane", "Wary", "Weary", "Whimsical", "Wield", "Willful", "Wince", "Wistful",
    "Xylophone", "Xenon", "Xerox", "Xylem", "Xenophile", "Xylograph", "X-axis", "Xenogenesis", "Xerography", "Xenophobic",
    "Yak", "Yearn", "Yield", "Yoke", "Yonder", "Youthful", "Yawn", "Yarn", "Yeast", "Yolk",
    "Zebra", "Zenith", "Zephyr", "Zest", "Zigzag", "Zilch", "Zodiac", "Zonal", "Zoom", "Zealous"
]

def choose_word():
    return random.choice(words)

def scramble_word(word):
    letters = list(word)
    random.shuffle(letters)
    return ''.join(letters)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scramble', methods=['POST'])
def scramble():
    word = choose_word()
    scrambled = scramble_word(word)
    return jsonify({'scrambled_word': scrambled, 'word': word})

@app.route('/check', methods=['POST'])
def check():
    data = request.get_json()
    guess = data['guess']
    word = data['word']
    if guess.lower() == word.lower():
        return jsonify({'result': 'correct'})
    else:
        return jsonify({'result': 'incorrect', 'word': word})

if __name__ == '__main__':
    app.run(debug=True)
