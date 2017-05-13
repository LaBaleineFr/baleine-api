import WordDefinition from "../models/word-definition";

/**
 * List word definitions
 * @returns {WordDefinition[]}
 */
function list(req, res, next) {
    WordDefinition.all()
        .then(wordDefinitions => res.json(wordDefinitions))
        .catch(e => next(e));
}

export default { list };