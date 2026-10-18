#!/usr/bin/env python3
"""Empaqueta el curso en un solo archivo HTML autónomo.

    python3 build.py [salida.html]

Mete estilos y datos en línea dentro de index.html, de modo que el resultado
funciona sin servidor: se puede abrir con doble clic o subir suelto a un
hosting. Desde file:// el navegador sigue considerándolo contexto seguro, así
que el micrófono y la síntesis de voz siguen disponibles.
"""
import re, sys, pathlib

raiz = pathlib.Path(__file__).parent
salida = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else raiz / 'curso-ingles.html')

html = (raiz / 'index.html').read_text(encoding='utf-8')
head = html.split('<head>', 1)[1].split('</head>', 1)[0]
body = html.split('<body>', 1)[1].split('</body>', 1)[0]

scripts = re.findall(r'<script src="([^"]+)"></script>', body)
body = re.sub(r'\s*<script src="[^"]+"></script>', '', body)

css = (raiz / 'styles.css').read_text(encoding='utf-8')
head = head.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
js = '\n'.join((raiz / s).read_text(encoding='utf-8') for s in scripts)

salida.write_text(
    '<!doctype html>\n<html lang="es">\n<head>' + head + '</head>\n<body>'
    + body.rstrip() + '\n<script>\n' + js + '\n</script>\n</body>\n</html>\n',
    encoding='utf-8')

print(f'{salida} · {salida.stat().st_size // 1024} KB · {len(scripts)} archivos embebidos')
