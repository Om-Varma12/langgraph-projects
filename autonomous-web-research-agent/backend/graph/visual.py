from IPython.display import Image, display

from graph.builder import graph


app = graph.compile()
png = app.get_graph().draw_mermaid_png()

with open("graph.png", "wb") as f:
    f.write(png)