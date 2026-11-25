# -*- coding: utf-8 -*-
"""
Created on Sat Oct 14 17:11:50 2023

@author: Arthur
"""
#%% Cadre de jeu
from cell import Cell
import settings
import outils
from tkinter import *

# Initialistaion de la fenêtre de jeu 
root = Tk()
root.geometry(f'{settings.WIDTH}x{settings.HEIGHT}')
root.title('Minesweeper Game')
root.resizable(False,False)
root.configure(bg = settings.BACKGROUND_COLOR) #Personnalisation (couleurs)

# Délimitation de différentes zones de la fenêtre : top, left, center 
top_frame = Frame( 
    root,
    bg = settings.BACKGROUND_COLOR,
    width = f'{settings.WIDTH}',
    height = outils.height_prct(25)    
    )
top_frame.place(x = 0, y = 0)

Minesweeper = Label(
    top_frame,
    bg = settings.BACKGROUND_COLOR,
    fg = settings.TEXT_COLOR,
    font = ('Times',50),
    text = 'Minesweeper'
    )
Minesweeper.place(x = outils.width_prct(25), y = 0)

left_frame = Frame(
    root,
    bg = settings.BACKGROUND_COLOR,
    width = outils.width_prct(25),
    height = outils.height_prct(75)
    )
left_frame.place(x = 0, y = outils.height_prct(25))

center_frame = Frame(
    root,
    bg = settings.BACKGROUND_COLOR,
    width = outils.width_prct(75),
    height = outils.height_prct(75 ),
    )
center_frame.place(x = outils.width_prct(25), y = outils.height_prct(25))

# Mise en place du jeu
for x in range(settings.GRID_SIZE) :
    for y in range(settings.GRID_SIZE) :
        c = Cell(x,y)
        c.create_btn_object(center_frame)
        c.cell_btn_object.grid(
            column = y,
            row = x
            )
        c.cell_btn_object.configure(
            bg = settings.BTN_COLOR
            )

# Création et mise en place des compteurs
Cell.create_cell_count_label(left_frame)
Cell.cell_count_label.grid(
    row = 0, 
    column = 0
    )

Cell.create_mines_count_label(left_frame)
Cell.mines_count_label.grid(
    row = 1,
    column = 0
    )

# Attribution des mines
Cell.randomize_mines()

    
# Bouton de fin de jeux
End_btn = Button(
    left_frame,
    text = 'Quitter le jeu',
    font = ('', 12),
    command = lambda : root.destroy()
    )
End_btn.grid(
    row = 5,
    column = 0
    )

root.mainloop()

