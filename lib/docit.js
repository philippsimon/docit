/**
 * @module DocIt
 *
 * Language independent translation of code comments into Markdown.
 */
var parser = require("./parser");

var COMMENT_TYPES = parser.COMMENT_TYPES;
var TAG_NAMES = parser.TAG_NAMES;

var DEFAULT_SETTINGS = {
    "apiLabel": "API:",
    "apiLabelMarkdown": "*",
    "authorLabel": "Author:",
    "authorLabelMarkdown": "*",
    "codeHandler": null,
    "codeHandlers": [
        {"\\.js$": "./codehandlers/jsCodeHandler"}
    ],
    "constructorLabel": "Constructor:",
    "constructorLabelMarkdown": "*",
    "defaultModuleHeading": "Module",
    "deprecatedLabel": "Deprecated:",
    "deprecatedLabelMarkdown": "*",
    "includePrivate": "false",
    "includeHRAfterMethod": "false",
    "includeHRBeforeMethod": "true",
    "horizontalRuleMarkdown": "\n------------------------------------------------\n",
    "methodHeadingMarkdown": "-",
    "methodSignatureMarkdown": "###",
    "moduleHeadingMarkdown": "=",
    "paramsHeading": "Parameters",
    "paramsHeadingMarkdown": "####",
    "paramsListMarkdown": "*",
    "paramTypeMarkdown": "*",
    "privateTypeLabel": " (private)",
    "privateVariableLabel": " (private)",
    "requiresLabel": "Requires:",
    "requiresLabelMarkdown": "*",
    "returnHeading": "Returns",
    "returnHeadingMarkdown": "####",
    "returnTypeMarkdown": "*",
    "seeLabel": "See:",
    "seeLabelMarkdown": "*",
    "throwsHeading": "Throws",
    "throwsHeadingMarkdown": "####",
    "throwsTypeMarkdown": "*",
    "typeNameMarkdown": "###",
    "typesHeading": "Types",
    "typesHeadingMarkdown": "-",
    "variableNameMarkdown": "###",
    "variablesHeading": "Variables",
    "variablesHeadingMarkdown": "-",
    "versionLabel": "Version:",
    "versionLabelMarkdown": "*"
};

var SIMPLE_TAGS = [
    {name: TAG_NAMES.AUTHOR, label: "authorLabel", labelMarkdown: "authorLabelMarkdown"},
    {name: TAG_NAMES.CONSTRUCTOR, label: "constructorLabel", labelMarkdown: "constructorLabelMarkdown"},
    {name: TAG_NAMES.DEPRECATED, label: "deprecatedLabel", labelMarkdown: "deprecatedLabelMarkdown"},
    {name: TAG_NAMES.REQUIRES, label: "requiresLabel", labelMarkdown: "requiresLabelMarkdown"},
    {name: TAG_NAMES.SEE, label: "seeLabel", labelMarkdown: "seeLabelMarkdown"},
    {name: TAG_NAMES.VERSION, label: "versionLabel", labelMarkdown: "versionLabelMarkdown"}
];

var settings = {
    get: function (property) {
        return DEFAULT_SETTINGS[property];
    }
};

/**
 * Maintain the state of the current types of comments being processed during the reduce phase.
 * @private
 */
var currentCommentType;

/**
 * Returns the comments array
 *
 * @param {String} commentedCode commentedCode
 * @param {Object} customSettings optional
 * @param {String} moduleName optional
 * @return {Array} comments
 */
var getComments = exports.getComments = function(commentedCode, customSettings, moduleName) {
    currentCommentType = null;
    if (customSettings) {
        settings = customSettings;
    }

    return parser.parse(commentedCode, determineCodeHandler(moduleName));
};

/**
 * Returns a Markdown string from an array of comments object
 *
 * @param {Array} comments array of comment objects
 * @param {String} moduleName optional
 * @return {String} markdown string
 */
var getMarkdown = exports.getMarkdown = function(comments, moduleName) {
	var md = "";
	for (var i = 0; i < comments.length; i++) {
        var comment = comments[i];
        switch (comment.type) {
            case COMMENT_TYPES.METHOD:
                comment = processMethodComment(comment);
                break;
            case COMMENT_TYPES.MODULE:
                comment = processModuleComment(comment, moduleName);
                break;
            case COMMENT_TYPES.TYPE:
                comment = processTypeComment(comment);
                break;
            case COMMENT_TYPES.VARIABLE:
                comment = processVariableComment(comment);
                break;
        }
        if (comment.length > 0) {
            md += comment + "\n";
        }
    }
    return md;
};

/**
 * Return a String of Markdown generated from the comments within some code that is provided as a String.
 *
 * @param {String} commentedCode commented code
 * @param {Object} customSettings optional settings to override defaults that can be used for example to determine method names
 * when these are not explicitly listed within comments
 * @param moduleName optional override for the name and main heading for the module comments. Also used to
 * determine the codeHandler associated with the module. If not specified then no codeHandler will be employed.
 * @return {String} the commented code as markdown according to the settings supplied or default settings.
 *
 */
exports.commentsToMD = function(commentedCode, customSettings, moduleName) {
	return getMarkdown(getComments(commentedCode, customSettings, moduleName), moduleName);
};

/**
 * Provide a means to set configuration for test purposese
 * @param config the configuration for docit
 * @private
 */
function setConfig(config) {
    settings = config;
}

function determineCodeHandler(moduleName) {
    var codeHandler = settings.get("codeHandler") ? require(settings.get("codeHandler")) : null;

    if (moduleName && !codeHandler) {
        var codeHandlers = settings.get("codeHandlers");
        for (var i = 0; codeHandlers && i < codeHandlers.length && codeHandler === null; i += 1) {
            for (var key in codeHandlers[i]) {
                codeHandler = moduleName.search(key) === -1 ? null : require(codeHandlers[i][key]);
            }
        }
    }
    return codeHandler;
}

function processModuleComment(comment, moduleName) {
    var md = "";
    var name = determineTagValue(TAG_NAMES.MODULE, comment) || moduleName || settings.get("defaultModuleHeading");

    md = applyMarkdown(name, settings.get("moduleHeadingMarkdown")) + "\n\n";

    if (comment.text) {
        md += comment.text + "\n\n";
    }

    md += processSimpleTags(comment);
    return md;
}

function processSimpleTags(comment) {
    var md = "";
    SIMPLE_TAGS.forEach(function (tagDetails) {
        var tagValue = determineTagValue(tagDetails.name, comment);
        if (tagValue) {
            md += applyMarkdown(settings.get(tagDetails.label), settings.get(tagDetails.labelMarkdown)) + " " +
                tagValue + "\n";
        }
    });

    return md;
}

function processMethodComment(comment) {
    var md = "";
    if (settings.get("includePrivate") === "false" && isPrivateComment(comment)) {
        return "";
    }
    if (settings.get("includeHRBeforeMethod") === "true") {
        md += settings.get("horizontalRuleMarkdown");
    }
    var methodName = determineTagValue(TAG_NAMES.METHOD, comment) || determineTagValue(TAG_NAMES.METHOD_NAME, comment);

    if (methodName) {
        md += applyMarkdown(methodName, settings.get("methodHeadingMarkdown")) + "\n\n";
    }
    var signature = determineTagValue(TAG_NAMES.METHOD_SIGNATURE, comment);
    if (signature) {
        md += applyMarkdown(signature, settings.get("methodSignatureMarkdown")) + "\n\n";
    }

    lineStart = "\n";
    if (comment.text) {
        md += comment.text + "\n";
        lineStart = "";
    }

    var paramsStarted = false;
    var tags = comment.tags;
    for (var i in tags) {
        for (var tagName in tags[i]) { // I wish I knew another in-built way to get hold of the key in a key/value pair
            switch (tagName) {
                case TAG_NAMES.API:
                    md += lineStart + applyMarkdown(settings.get("apiLabel"), settings.get("apiLabelMarkdown")) + " " +
                        determineTagValue(TAG_NAMES.API, comment);
                    lineStart = "\n";
                    break;
                case TAG_NAMES.PARAM:
                    if (!paramsStarted) {
                        md += lineStart + applyMarkdown(settings.get("paramsHeading"),
                            settings.get("paramsHeadingMarkdown")) + "\n\n";
                        paramsStarted = true;
                    }
                    md += processParamTag(tags[i][tagName]) + "\n";
                    lineStart = "\n";
                    break;
                case TAG_NAMES.PRIVATE:
                    md += lineStart + applyMarkdown(settings.get("apiLabel"), settings.get("apiLabelMarkdown")) +
                        " private" + "\n";
                    lineStart = "\n";
                    break;
                case TAG_NAMES.RETURN:
                    md += lineStart + applyMarkdown(settings.get("returnHeading"), settings.get("returnHeadingMarkdown")) +
                        "\n\n";
                    md += processMethodOutTag(tags[i][tagName], "returnTypeMarkdown") + "\n";
                    lineStart = "\n";
                    break;
                case TAG_NAMES.EXCEPTION:
                case TAG_NAMES.THROWS:
                    md += lineStart + applyMarkdown(settings.get("throwsHeading"), settings.get("throwsHeadingMarkdown")) +
                        "\n\n";
                    md += processMethodOutTag(tags[i][tagName], "throwsTypeMarkdown") + "\n";
                    lineStart = "\n";
                    break;
            }
        }
    }

    if (settings.get("includeHRAfterMethod") === "true") {
        md += settings.get("horizontalRuleMarkdown");
    }
    return md;
}

function processVariableComment(comment) {
    if (settings.get("includePrivate") === "false" && isPrivateComment(comment)) {
        return "";
    }
    var md = "";
    if (currentCommentType !== COMMENT_TYPES.VARIABLE) {
        md += applyMarkdown(settings.get("variablesHeading"),
            settings.get("variablesHeadingMarkdown")) + "\n";
        currentCommentType = COMMENT_TYPES.VARIABLE;
    }
    var varNameLine = determineTagValue(TAG_NAMES.VARIABLE_NAME, comment);
    if (isPrivateComment(comment)) {
        varNameLine += settings.get("privateVariableLabel");
    }
    md += "\n" + applyMarkdown(varNameLine, settings.get("variableNameMarkdown")) + "\n\n";

    md += comment.text + "\n";

    return md;
}

function processTypeComment(comment) {
    if (settings.get("includePrivate") === "false" && isPrivateComment(comment)) {
        return "";
    }
    var md = "";
    if (currentCommentType !== COMMENT_TYPES.TYPE) {
        md += applyMarkdown(settings.get("typesHeading"),
            settings.get("typesHeadingMarkdown")) + "\n";
        currentCommentType = COMMENT_TYPES.TYPE;
    }
    var typeNameLine = determineTagValue(TAG_NAMES.CLASS, comment);
    if (isPrivateComment(comment)) {
        typeNameLine += settings.get("privateTypeLabel");
    }

    md += "\n" + applyMarkdown(typeNameLine, settings.get("typeNameMarkdown")) + "\n";

    md += processSimpleTags(comment);

    md += "\n" + comment.text + "\n";

    return md;
}

function processParamTag(paramTag) {
    var md = settings.get("paramsListMarkdown") + " " + paramTag.name + " ";
    if (paramTag.type) {
        md += applyMarkdown(paramTag.type, settings.get("paramTypeMarkdown")) + " ";
    }
    md += paramTag.comment;
    return md;
}

/**
 * Process either a return or throws tag.
 * @param tag the tag
 * @param {String} typeMarkdown the markdown identifier to associate with the type of the tag if present
 * @return {String} the markdown for the tag
 * @private
 */
function processMethodOutTag(tag, typeMarkdown) {
    var md = "";
    if (tag.type) {
        md += applyMarkdown(tag.type, settings.get(typeMarkdown)) + " ";
    }
    md += tag.comment;
    return md;
}

function applyMarkdown(text, markDown) {
    var md;
    switch (markDown) {
        case "=":
        case "-":
            md = text + "\n" + charConcat(markDown, text.length);
            break;
        case "#":
        case "##":
        case "###":
        case "####":
        case "#####":
        case "######":
            md = markDown + " " + text + " " + markDown;
            break;
        default:
            md = markDown + text + markDown;
    }
    return md;
}

function charConcat(c, count) {
    var s = "";
    for (var i = 0; i < count; i++) {
        s += c;
    }
    return s;
}

function isPrivateComment(comment) {
    return determineTagValue(TAG_NAMES.PRIVATE, comment) !== null ||
        (determineTagValue(TAG_NAMES.API, comment) !== null &&
            determineTagValue(TAG_NAMES.API, comment).toLocaleLowerCase() === "private");
}

function determineTagValue(tagName, comment) {
    var tagValue = null;
    if (comment.tags && comment.tags.length > 0) {
        for (var i = 0; i < comment.tags.length && tagValue === null; i++) {
            var tag = comment.tags[i];
            tagValue = tag[tagName] === undefined ? null : tag[tagName];
        }
    }

    return tagValue;
}
exports.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
