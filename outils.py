# -*- coding: utf-8 -*-
"""
Created on Wed Nov 22 14:30:39 2023

@author: Arthur
"""

import settings

# Fonction calculant les dimensions des différentes parties de la fenêtre
def height_prct(percent) :
    return (settings.HEIGHT/100)*percent

def width_prct(percent) :
    return (settings.WIDTH/100)*percent


"""
def width_btn() :
    return int(width_prct(75)//settings.GRID_SIZE)
#    return settings.WIDTH//settings.GRID_SIZE//50*3

def height_btn() :
    return int(height_prct(75)//settings.GRID_SIZE)
#    return settings.HEIGHT//settings.GRID_SIZE//50
"""