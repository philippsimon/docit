exports.options = {
    "apiLabel": {
        "default": "API:",
        "describe": "The label to associate with an api tag comment."
    },
    "apiLabelMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown for the api label."
    },
    "authorLabel": {
        "default": "Author:",
        "describe": "The label to associate with an author tag comment."
    },
    "authorLabelMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown for the author label."
    },
    "codeHandler": {
        "default": null,
        "describe": "An optional code handler to handle code specific aspects of the output markdown. For example method signature and deriving method name from signature when not specified within the method comment. If specified codeHandler will override codeHandlers."
    },
    "codeHandlers": {
        "default":  [{"\\.js": "./codehandlers/jsCodeHandler"}],
        "describe": "Mappings of code handlers to expressions. Used to associated code handlers with corresponding files e.g. javascript files with .js files."
    },
    "config": {
        "describe": "Path to a json configuration file defining custom options. All command line options - except this one and --help - will be used if present. Options specified directly on the command line override file loaded options."
    },
    "constructorLabel": {
        "default": "Constructor:",
        "describe": "The label to associate with a constructor tag comment."
    },
    "constructorLabelMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown for the constructor label."
    },
    "defaultModuleHeading": {
        "default": "Module",
        "describe": "The default heading for a any module that does not include one. This is only used when docit takes its input from stdio. Otherwise the input filename becomes the default module name."
    },
    "deprecatedLabel": {
        "default": "Deprecated:",
        "describe": "The label to associate with an deprecated tag comment."
    },
    "deprecatedLabelMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown for the deprecated label."
    },
    "dir" : {
        "describe": "Path to folder containing commented code to be processed by docit. Docit will recurse down any subfolders within this directory path."
    },
    "includeFiles": {
        "default": null,
        "describe": "Comma separated list of file names or expressions used to determine the files to process when --dir option is employed."
    },
    "includeHRAfterMethod": {
        "default": "true",
        "describe": "Include a horizontal rule after a method comment."
    },
    "includeHRBeforeMethod": {
        "default": "false",
        "describe": "Include a horizontal rule before a method comment."
    },
    "includePrivate": {
        "default": "false",
        "describe": "Include comments that are labelled as @private or @api private in the resulting md."
    },
    "help": {
        "alias": "h",
        "describe": "This message."
    },
    "horizontalRuleMarkdown": {
        "default": "* * *\n\n",
        "describe": "Horizontal rule markdown string."
    },
    "methodHeadingMarkdown": {
        "default": "-",
        "describe": "Method heading markdown. Single - and = characters are interpreted as underlines spanning the length of the method name."
    },
    "methodSignatureMarkdown": {
        "default": "###",
        "describe": "Markdown to be applied to method signatures."
    },
    "moduleHeadingMarkdown": {
        "default": "=",
        "describe": "Module heading markdown. Single - and = characters are interpreted as underlines spanning the length of the module name."
    },
    "out" : {
        "default": "md",
        "describe": "Path of directory into which to write generated markdown files. This option is only valid when the --dir option is also specified. Each input file will result in a .md equivalent within the named directory. This directory and sub-directories where required will be created if they do not exist"
    },
    "paramsHeading": {
        "default": "Parameters",
        "describe": "By default the list of method parameters is given a heading. This is that heading."
    },
    "paramsHeadingMarkdown": {
        "default": "####",
        "describe": "The markdown to be applied to the parameters list heading."
    },
    "paramsListMarkdown": {
        "default": "*",
        "describe": "This markdown for the list style of method parameter comments."
    },
    "paramTypeMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown surrounding the type of a parameter."
    },
    "privateTypeLabel": {
        "default": " (private)",
        "describe": "Label displayed adjacent to the type name when the type is private."
    },
    "privateVariableLabel": {
        "default": " (private)",
        "describe": "Label displayed adjacent to the variable name when the variable is private."
    },
    "requiresLabel": {
        "default": "Requires:",
        "describe": "The label used to tag the line of modules upon which the current module depends."
    },
    "requiresLabelMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown surrounding the requires label."
    },
    "returnHeading": {
        "default": "Returns",
        "describe": "By default the description of the return value from a method is given a heading. This is that heading."
    },
    "returnHeadingMarkdown": {
        "default": "####",
        "describe": "The markdown to be applied to the return heading."
    },
    "returnTypeMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown surrounding the type of the thing returned from a method."
    },
    "seeLabel": {
        "default": "See:",
        "describe": "The label to associate with a see tag comment."
    },
    "seeLabelMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown for the see label."
    },
    "throwsHeading": {
        "default": "Throws",
        "describe": "By default the description of any throws value from a method is given a heading. This is that heading."
    },
    "throwsHeadingMarkdown": {
        "default": "####",
        "describe": "The markdown to be applied to the throws heading."
    },
    "throwsTypeMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown surrounding the type of an exception thrown by a method."
    },
    typeNameMarkdown: {
        "default": "###",
        "describe": "The markdown to be applied to type names."
    },
    "typesHeading": {
        "default": "Types",
        "describe": "Heading for types section in the generated markdown."
    },
    "typesHeadingMarkdown": {
        "default": "-",
        "describe": "Type heading markdown. Single - and = characters are interpreted as underlines spanning the length of the method name."
    },
    variableNameMarkdown: {
        "default": "###",
        "describe": "The markdown to be applied to variable names."
    },
    "variablesHeading": {
        "default": "Variables",
        "describe": "Heading for variables section in the generated markdown."
    },
    "variablesHeadingMarkdown": {
        "default": "-",
        "describe": "Varibales heading markdown. Single - and = characters are interpreted as underlines spanning the length of the method name."
    },
    "versionLabel": {
        "default": "Version:",
        "describe": "The label to associate with a version tag comment."
    },
    "versionLabelMarkdown": {
        "default": "*",
        "describe": "The emphasis markdown for the version label."
    }
};