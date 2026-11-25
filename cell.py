# -*- coding: utf-8 -*-
"""
Created on Mon Dec  4 16:21:35 2023

@author: Arthur
"""

#%% Classe 

from tkinter import Button, Label, Tk
import random
import settings


class Cell :
    all = [] # Initialisation d'une liste regroupant tout les éléments du jeu
    cell_count = settings.CELL_COUNT #Initialisation des différents compteurs
    mines_count = settings.MINES_COUNT
    cell_count_label = None
    mines_count_label = None
    def __init__(self, x, y, is_mine = False) : #initialisation de la classe Cell
        self.is_mine = is_mine # Attribut pour savoir s'il s'agit d'une mine ou non
        self.is_opened = False # Attribut pour savoir si la case a déjà été ouverte 
        self.is_flagged = False # Attribut pour savoir si la case est marquée d'un flag 
        self.cell_btn_object = None # Attribut associant l'objet à un objet bouton de tkinter
        self.x = x # Attribut pour la coordonnée en x
        self.y = y # Attribut pour la coordonnée en y
        
        Cell.all.append(self)
        
        
    def create_btn_object(self, location) : # Méthode pour associer un objet Cell à un bouton de tkinter
        btn = Button(
            location,
            width = settings.BTN_WIDTH,
            height = settings.BTN_HEIGHT,        
            )
        btn.bind(
            '<Button-1>',
            self.left_click_actions
            )
        btn.bind(
            '<Button-3>',
            self.right_click_actions
            )
        self.cell_btn_object = btn
    
    
    @staticmethod # On n'utilise pas un objet de la classe 
    def create_cell_count_label(location) : # Méthode statique pour créer le décompte des cases restantes à gérer
        label = Label(
            location,
            text = f" Cells Left : {Cell.cell_count}",
            width = 15,
            height = 3,
            bg = settings.BACKGROUND_COLOR,
            fg = settings.TEXT_COLOR,
            font = ('', 10)
            )
        Cell.cell_count_label = label
    
    @staticmethod
    def create_mines_count_label(location) : # Méthode similaire pour créer le décompte des drapeaux restants à placer
        label = Label(
            location,
            text = f" Mines Left : {Cell.mines_count}",
            width = 15,
            height = 3,
            bg = settings.BACKGROUND_COLOR,
            fg = settings.TEXT_COLOR,
            font = ('', 10)
            )
        Cell.mines_count_label = label
        
    def left_click_actions(self, event) : # Méthode gérant les actions liées à un clique gauche (dévoiler une/des case(s))
        if self.is_mine == True :
            self.show_mine()
        else :
            if self.surrounds_mines == 0 :
                for cell in self.surrounds :
                    cell.show_cell()
                self.show_cell()
            self.show_cell()
            
            if self.is_opened == True and self.surrounds_mines == self.surrounds_flags : # Fonctionnalite non essentielle mais ameliore l'experience
                for cell in self.surrounds :
                    if cell.is_flagged == False :
                        if cell.is_mine == True :
                            cell.show_mine()
                        else :
                            cell.show_cell()
                        
    
    def right_click_actions(self,event) : # Méthode gérant les actions liées à un clique droit (placer un drapeau)
        if self.is_flagged == False and self.is_opened == False:
            self.cell_btn_object.configure(
                bg = settings.FLAG_COLOR
                )
            self.is_flagged = True
            Cell.cell_count -= 1
            Cell.cell_count_label.configure(
                text = f" Cells Left : {Cell.cell_count}"
                )
            Cell.mines_count -= 1
            Cell.mines_count_label.configure(
                text = f" Mines Left : {Cell.mines_count}"
                )
        else :
            self.cell_btn_object.configure(
                bg = settings.BTN_COLOR
                )
            if self.is_flagged == True and self.is_opened == False:
                Cell.cell_count += 1
                Cell.cell_count_label.configure(
                    text = f" Cells Left : {Cell.cell_count}"
                    )
                Cell.mines_count += 1
                Cell.mines_count_label.configure(
                    text = f" Mines Left : {Cell.mines_count}"
                    )                
            self.is_flagged = False
        if Cell.cell_count == 0 :
            Cell.good_end()
            
            
    def show_mine(self) : # Evènement quand partie perdue / afficher les mines         
        Cell.bad_end()
        self.cell_btn_object.configure(
            bg = 'red'
            )
        for cell in Cell.all :
            if cell.is_mine == True :
                cell.cell_btn_object.configure(
                    bg = 'red'
                    )
            else :
                cell.show_cell()
                
                
    def show_cell(self) : # Evènement pour case sélectionnée si elle n'est pas une mine
        if self.is_opened == False :
            if self.surrounds_mines == 0 :
                self.cell_btn_object.configure(
                    bg = settings.BTN_COLOR,
                    text = f'{self.surrounds_mines}',
                    fg = 'black'
                    )
            if self.surrounds_mines == 1 :
                self.cell_btn_object.configure(
                    bg = settings.BTN_COLOR,
                    text = f'{self.surrounds_mines}',
                    fg = 'blue',
                    )
            if self.surrounds_mines == 2 :
                self.cell_btn_object.configure(
                    bg = settings.BTN_COLOR,
                    text = f'{self.surrounds_mines}',
                    fg = 'green'
                    )
            if self.surrounds_mines == 3 :
                self.cell_btn_object.configure(
                    bg = settings.BTN_COLOR,
                    text = f'{self.surrounds_mines}',
                    fg = 'darkorange',
                    )
            if self.surrounds_mines == 4 :
                self.cell_btn_object.configure(
                    bg = settings.BTN_COLOR,
                    text = f'{self.surrounds_mines}',
                    fg = 'red'
                    )
            if self.surrounds_mines == 5 :
                self.cell_btn_object.configure(
                    bg = settings.BTN_COLOR,
                    text = f'{self.surrounds_mines}',
                    fg = 'purple'
                    )
            if self.surrounds_mines == 6 :
                self.cell_btn_object.configure(
                    bg = settings.BTN_COLOR,
                    text = f'{self.surrounds_mines}',
                    fg = 'darkgreen'
                    )    
            if self.surrounds_mines == 7 :
                self.cell_btn_object.configure(
                    bg = settings.BTN_COLOR,
                    text = f'{self.surrounds_mines}',
                    fg = 'yellow'
                    )
            if self.surrounds_mines == 8 :
                self.cell_btn_object.configure(
                    bg = settings.BTN_COLOR,
                    text = f'{self.surrounds_mines}',
                    fg = 'gray'
                    )
            if Cell.cell_count_label and self.is_flagged == False :
                Cell.cell_count -= 1
                Cell.cell_count_label.configure(
                    text = f" Cells Left : {Cell.cell_count}"
                    )
            if self.is_flagged == True :
                Cell.mines_count += 1
                Cell.mines_count_label.configure(
                    text = f" Mines Left : {Cell.mines_count}"
                    )                
        self.is_opened = True
        
        if Cell.cell_count == 0 and Cell.mines_count == 0:
            Cell.good_end()
            
    @property
    def surrounds(self) : # Méthode donnant la liste des cases voisines de self
        cells = [
            self.get_cell_by_axis(self.x - 1, self.y - 1),
            self.get_cell_by_axis(self.x - 1, self.y ),
            self.get_cell_by_axis(self.x - 1, self.y + 1),
            self.get_cell_by_axis(self.x, self.y - 1),
            self.get_cell_by_axis(self.x, self.y + 1),
            self.get_cell_by_axis(self.x + 1, self.y - 1),
            self.get_cell_by_axis(self.x + 1, self.y),
            self.get_cell_by_axis(self.x + 1, self.y + 1)
            ]
        cells = [cell for cell in cells if cell is not None]
        return cells
    
    @property
    def surrounds_mines(self) : # Méthode donnant le nombre de mines parmi les cases voisines
        mines = 0
        for cell in self.surrounds :
            if cell.is_mine :
                mines +=1
        return mines
    
    @property
    def surrounds_flags(self) : # Méthode donnant le nombre de flags parmi les cases voisines
        flags = 0
        for cell in self.surrounds :
            if cell.is_flagged == True :
                flags +=1
        return flags
        
    def get_cell_by_axis(self,x,y) : # Méthode renvoyant la case occupant la ligne x et la colonne y
        for cell in Cell.all :
            if cell.x == x and cell.y == y :
                return cell
    
    @staticmethod
    def randomize_mines() : # Méthode permettant d'attribuer aléatoirement le statut de mine à un nombre prédéfini de cases
        picked_cells = random.sample(
            Cell.all,
            settings.MINES_COUNT
            )
        for cell in picked_cells :
            cell.is_mine = True
            
    @staticmethod
    def good_end() : # Méthode gérant la fin victorieuse
        End = Tk()
        txt_good_end = Button(
            End,
            text = settings.T_G_E,
            bg = f'{settings.GOOD_RESTART_BUTTON_COLOR}',
            command = lambda : Cell.New(End)
            )
        txt_good_end.pack()
        Exit = Button(
            End,
            text = 'exit',
            bg = 'red',
            command = lambda : End.destroy()
            )
        Exit.pack()
    
    @staticmethod
    def bad_end() : # Méthode gérant la défaite
        End = Tk()
        txt_bad_end = Button(
            End,
            text = settings.T_B_E,
            bg = f'{settings.BAD_RESTART_BUTTON_COLOR}',
            command = lambda : Cell.New(End)
            )
        txt_bad_end.pack()
        Exit = Button(
            End,
            text = 'exit',
            bg = 'red',
            command = lambda : End.destroy()
            )
        Exit.pack()

   
    def __repr__(self) : # Méthode permettant de représenter un objet de la classe sous un string
        return f"Cell({self.x}, {self.y})"
    
    @staticmethod
    def New(End): # Méthode pour relancer une partie
        End.destroy()
        Cell.cell_count = settings.CELL_COUNT
        Cell.mines_count = settings.MINES_COUNT
      
        Cell.cell_count_label.configure(text=f" Cells Left : {Cell.cell_count}")
        Cell.mines_count_label.configure(text=f" Mines Left : {Cell.mines_count}")

        for cell in Cell.all:
            cell.is_mine = False
            cell.is_opened = False
            cell.is_flagged = False
            cell.cell_btn_object.configure(
                bg=settings.BTN_COLOR, 
                text = ""
                )

        Cell.randomize_mines()
        
    
   