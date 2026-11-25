# -*- coding: utf-8 -*-
"""
Created on Wed Nov 22 14:15:09 2023

@author: Arthur
"""

import outils

# Dimensions de la fenêtre
WIDTH = 700
HEIGHT = 700 

# Dimensions de la grille et des boutons
GRID_SIZE = 6
BTN_HEIGHT = HEIGHT//GRID_SIZE//50
BTN_WIDTH = BTN_HEIGHT*3
CELL_COUNT = GRID_SIZE**2
MINES_COUNT = CELL_COUNT // 4

# Couleurs de la fenêtre et du texte
BACKGROUND_COLOR = 'lightgreen'
TEXT_COLOR = 'blue'

# Couleur des éléments du jeu
BTN_COLOR = 'white'
FLAG_COLOR = 'orange'
MINE_COLOR = 'red'

# Couleur des boutons de fin
BAD_RESTART_BUTTON_COLOR = 'red'
T_B_E = 'You lost, try again'

GOOD_RESTART_BUTTON_COLOR = 'green'
T_G_E = "Congrats ! Let's go again"