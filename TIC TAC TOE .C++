#include <iostream>
using namespace std;

char board[3][3] = { { ' ', ' ', ' ' }, { ' ', ' ', ' ' }, { ' ', ' ', ' ' } };
char currentPlayer = 'X';

void drawBoard() {
    cout << "  1 2 3" << endl;
    for (int i = 0; i < 3; i++) {
        cout << i + 1 << " ";
        for (int j = 0; j < 3; j++) {
            cout << board[i][j];
            if (j < 2) cout << "|";
        }
        cout << endl;
        if (i < 2) cout << "  -+-+-" << endl;
    }
}

bool isMoveValid(int row, int col) {
    if (row < 0 || row >= 3 || col < 0 || col >= 3)
        return false;
    if (board[row][col] != ' ')
        return false;
    return true;
}

bool isGameOver() {
    // Check rows, columns, and diagonals for a win
    for (int i = 0; i < 3; i++) {
        if (board[i][0] == currentPlayer && board[i][1] == currentPlayer && board[i][2] == currentPlayer)
            return true;
        if (board[0][i] == currentPlayer && board[1][i] == currentPlayer && board[2][i] == currentPlayer)
            return true;
    }
    if (board[0][0] == currentPlayer && board[1][1] == currentPlayer && board[2][2] == currentPlayer)
        return true;
    if (board[0][2] == currentPlayer && board[1][1] == currentPlayer && board[2][0] == currentPlayer)
        return true;

    // Check for a tie
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[i][j] == ' ')
                return false; // There are still empty spaces, the game can continue
        }
    }
    return true; // No empty spaces, it's a tie
}

void switchPlayer() {
    if (currentPlayer == 'X')
        currentPlayer = 'O';
    else
        currentPlayer = 'X';
}

void resetBoard() {
    // Reset the board to its initial state
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            board[i][j] = ' ';
        }
    }
}

int main() {
    int again;
    do {
        int row;
        int col;
        bool validMove = false;

        cout << " \t \t \t Welcome to Tic Tac Toe!" << endl;

        resetBoard(); // Reset the board before starting a new game

        while (true) {
            drawBoard();
            cout << "Player " << currentPlayer << " enter your move (row and column): ";
            cin >> row >> col;

            row--; // Convert to 0-based index
            col--;

            validMove = isMoveValid(row, col);

            if (validMove) {
                board[row][col] = currentPlayer;

                if (isGameOver()) {
                    drawBoard();
                    if (isGameOver() ==!isMoveValid(row, col)) {
                        cout << "Player " << currentPlayer << " wins!" << endl;
                        //cout << "It's a tie!" << endl;
                    } else {
                        cout << "It's a tie!" << endl;
                        //cout << "Player " << currentPlayer << " wins!" << endl;
                    }
                    break;
                }

                switchPlayer();
            } else {
                cout << "Invalid move. Try again." << endl;
            }
        }

        cout << "Press 1 to play again or 2 to end: ";
        cin >> again;

    } while (again == 1);

    return 0;
}

