let darkTheme = {
    div: '#333',
    text: '#fff',

    inputColor: '#bbb',
    inputBorder: '#bbb'
}

const addModalDarkTheme = {
    titleInputBackground: '#ffffff10',
    titleInputColor: '#bbb',
    titleInputBorder: '#bbb'
}

darkTheme = Object.assign(darkTheme, addModalDarkTheme);

const themeCollections = {
    light: {
        background: "#fff",
        backgroundVariant: "#ddd",
        secondaryBackground: "#ddd",
        primaryButton: "#39924a",
        primaryButtonVariant: "#238636",
        borderColor: "#ccc",
        text: "#222",
        secondaryText: "#888",

        error: "#ff2424",
        success: "#238636",
        unconfirmed: "#21262d",
        info: "#58a6ff",

        changed: "#d29922",
        addition: "#12261e",
        deletion: "#301a1f"
    },
    dark: {
        background: "#0d1117",
        backgroundVariant: "#161b22",
        secondaryBackground: "#13161b",
        primaryButton: "#238636",
        primaryButtonVariant: "#39924a",
        borderColor: "#181e27",
        text: "#fff",
        secondaryText: "#999",

        error: "#ff2424",
        success: "#238636",
        unconfirmed: "#21262d",
        info: "#388bfd26",

        changed: "#544322",
        addition: "#12261e",
        deletion: "#301a1f"
    }
}

export { darkTheme, themeCollections }