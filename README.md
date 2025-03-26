# Heimdall
Un lugar feliz para programar

# GitHub comandos

# Clonar un repositorio
git clone https://github.com/MyTsKi/TaBP.git

# Seleccionar la rama main
git checkout "main"

# Hacer tu directorio un repositorio de Git
git init

# Hacer la conexion del dirrectorio remoto(GitHub) con nuestra carpeta
git remote add origin URL

# Para ver el esatdo del repositorio Git
git status

# A PARTIR DE AQUI ES PARA HACER COMMIT Y PUSH AL DOCUMENTO GITHUB
# Para versionar un archivo(el archivo en rojo) y posteriormente tiene que estar en verde

# (si es un archivo en espesifico el que vas a añadir)
git add NOMBE DEL ARCHIVO 

# (vas a añadir todos los archivos que modificaste)
git add . 

# Para ver el esatdo del repositorio Git
git status

# Hacer Commit
git commit -m "TEXTO DE LO QUE SE REALIZO"

# Hacer el Push despues del commit
git push origin main

# Cada que se haga un push despues un PULL para estar al dia de los cambios igual cada que alguien actualice el repositorio nos avisa y descargamos los cambios con el siguiente comando
git pull