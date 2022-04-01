// Copyright (c) Mike Schaeffer. All rights reserved.
//
// The use and distribution terms for this software are covered by the
// Eclipse Public License 2.0 (https://opensource.org/licenses/EPL-2.0)
// which can be found in the file LICENSE at the root of this distribution.
// By using this software in any fashion, you are agreeing to be bound by
// the terms of this license.
//
// You must not remove this notice, or any other, from this software.

#include <stdlib.h>
#include <stdio.h>
#include <string.h>

void FAIL(char *error) {
     fprintf(stderr, "%s\n", error);
     exit(1);
}

int MIN(int x, int y) {
     if (x < y)
          return x;
     else
          return y;
}

#define SIDE_LEFT true
#define SIDE_TOP false

#define MAX_MATCHSTICKS (80)
#define MAX_SQUARES (80)

struct board_t {
     int sx;
     int sy;
     char board[MAX_MATCHSTICKS];
     struct board_t *prev;
};

struct stick_t {
     int x;
     int y;
     bool side;
};

struct square_t {
     int x;
     int y;
     int size;
};

void init_board(int sx, int sy, struct board_t *board) {
     board->sx = sx;
     board->sy = sy;
     memset(board->board, 0, MAX_MATCHSTICKS);
     board->prev = NULL;
}

bool boards_equal(struct board_t *boardX, struct board_t *boardY) {
     if (boardX->sx != boardY->sx)
          return false;

     if (boardX->sy != boardY->sy)
          return false;

     return memcmp(boardX->board, boardY->board,
                   sizeof(char) * MAX_MATCHSTICKS) == 0;
}

void copy_board(struct board_t *to, struct board_t *from) {
     memcpy(to, from, sizeof(struct board_t));
     to->prev = from;
}

bool find_board_in_history(struct board_t *boards, struct board_t *board) {
     while(boards) {
          if (boards_equal(boards, board))
               return true;

          boards = boards->prev;
     }

     return false;
}

void set_match_stick(struct board_t *board, int x, int y, bool sideLeft, bool present) {
     int ofs = ((2 * x) + (sideLeft ? 0 : 1)) + (board->sx * 3 * y);

     board->board[ofs] = present;
}

bool get_match_stick(struct board_t *board, int x, int y, bool sideLeft) {
     int ofs = ((2 * x) + (sideLeft ? 0 : 1)) + (board->sx * 3 * y);

     return board->board[ofs];
}

bool is_square_at(struct board_t *board, int x, int y, int size) {
     int sx = board->sx;
     int sy = board->sy;

     if ((x < 0) || (y < 0) || (x + size > sx) || (y + size > sy))
          return false;

     for(int cx = x; cx < x + size; cx++) {
          if (!get_match_stick(board, cx, y, SIDE_TOP))
               return false;

          if (!get_match_stick(board, cx, y + size, SIDE_TOP))
               return false;
     }

     for(int cy = y; cy < y + size; cy++) {
          if (!get_match_stick(board, x, cy, SIDE_LEFT))
               return false;

          if (!get_match_stick(board, x + size, cy, SIDE_LEFT))
               return false;
     }

     return true;
}

void set_square(struct board_t *board, int x, int y, int size) {
    int sx = board->sx;
    int sy = board->sy;

    if ((x < 0) || (y < 0) || (x + size > sx) || (y + size > sy))
        FAIL("Square parameters out of range.");

    for(int cx = x; cx < x + size; cx++) {
        set_match_stick(board, cx, y, SIDE_TOP, true);
        set_match_stick(board, cx, y + size, SIDE_TOP, true);
    }

    for(int cy = y; cy < y + size; cy++) {
        set_match_stick(board, x, cy, SIDE_LEFT, true);
        set_match_stick(board, x + size, cy, SIDE_LEFT, true);
    }
}

int get_squares(struct board_t *board, struct square_t *squares) {
     int sx = board->sx;
     int sy = board->sy;

     int sqno = 0;

     for(int cx = 0; cx < sx; cx++) {
          for(int cy = 0; cy < sy; cy++) {
               int maxSize = MIN(sx - cx, sy - cy);

               for(int size = 1; size <= maxSize; size++) {
                    if(is_square_at(board, cx, cy, size)) {
                         squares[sqno].x = cx;
                         squares[sqno].y = cy;
                         squares[sqno].size = size;
                         sqno++;
                    }
               }
          }
     }

     return sqno;
}

int count_squares(struct board_t *board) {
     int sx = board->sx;
     int sy = board->sy;

     int squareCount = 0;

     for(int cx = 0; cx < sx; cx++) {
          for(int cy = 0; cy < sy; cy++) {
               int maxSize = MIN(sx - cx, sy - cy);

               for(int size = 1; size <= maxSize; size++) {
                    if(is_square_at(board, cx, cy, size)) {
                         squareCount++;
                    }
               }
          }
     }

     return squareCount;
}

void set_squares(struct board_t *board, struct square_t *squares, int nsquares) {
     for(int ii = 0; ii < nsquares; ii++) {
          set_square(board, squares[ii].x, squares[ii].y, squares[ii].size);
     }
}

int query_stick_locations(struct board_t *board, struct stick_t *sticks, bool query_value) {
     int sx = board->sx;
     int sy = board->sy;

     int stickno = 0;

     for(int cx = 0; cx <= sx; cx++) {
          for(int cy = 0; cy <= sy; cy++) {
               if ((cx < sx) && (get_match_stick(board, cx, cy, SIDE_TOP) == query_value)) {
                    sticks[stickno].x = cx;
                    sticks[stickno].y = cy;
                    sticks[stickno].side = SIDE_TOP;
                    stickno++;
               }

               if ((cy < sy) && (get_match_stick(board, cx, cy, SIDE_LEFT) == query_value)) {
                    sticks[stickno].x = cx;
                    sticks[stickno].y = cy;
                    sticks[stickno].side = SIDE_LEFT;
                    stickno++;
               }
          }
     }

     return stickno;
}

int get_all_sticks(struct board_t *board, struct stick_t *sticks) {
     return query_stick_locations(board, sticks, true);
}

int get_all_empty_sticks(struct board_t *board, struct stick_t *sticks) {
     return query_stick_locations(board, sticks, false);
}

int count_sticks(struct board_t *board) {
     int counter = 0;

     for(int ii = 0; ii < MAX_MATCHSTICKS; ii++) {
          if (board->board[ii])
               counter++;
     }

     return counter;
}

void move_stick(struct board_t *board, struct stick_t *from, struct stick_t *to) {
    set_match_stick(board, from->x, from->y, from->side, false);
    set_match_stick(board, to->x, to->y, to->side, true);
}

int count;
int squareTestCount;

bool board_meets_search_criteria(struct board_t *board, int target_squares) {
    if (count_squares(board) != target_squares)
        return false;

    squareTestCount++;

    struct square_t squares[MAX_SQUARES];
    int sqcount = get_squares(board, squares);

    struct board_t test_board;
    init_board(board->sx, board->sy, &test_board);

    set_squares(&test_board, squares, sqcount);

    return boards_equal(board, &test_board);
}

bool search0(struct board_t *boards, int max_depth, int target_squares) {
    count++;

    if (board_meets_search_criteria(boards, target_squares))
         return true;

    if (max_depth <= 0)
         return false;

    struct stick_t sticks[MAX_MATCHSTICKS];
    struct stick_t empty_sticks[MAX_MATCHSTICKS];

    int numsticks = get_all_sticks(boards, sticks);
    int numemptysticks = get_all_empty_sticks(boards, empty_sticks);

    for(int fromIndex = 0; fromIndex < numsticks; fromIndex++) {
        for(int toIndex = 0; toIndex < numemptysticks; toIndex++) {

             struct board_t new_board;
             copy_board(&new_board, boards);

             move_stick(&new_board, &sticks[fromIndex], &empty_sticks[toIndex]);

             if (find_board_in_history(boards, &new_board))
                continue;

             if(search0(&new_board, max_depth - 1, target_squares))
                  return true;
        }
    }

    return false;
}


bool search(struct board_t *board, int max_depth, int target_squares) {
    count = 0;
    squareTestCount = 0;

    bool result = search0(board, max_depth, target_squares);

    printf("n=%d %d\n", count, squareTestCount);

    return result;
}

////////////////////////////////////////////////////////////////

void print_board_hrow(struct board_t *board, int cy)
{
     int sx = board->sx;

     for(int cx = 0; cx < sx; cx++) {
          printf(" ");

          if (get_match_stick(board, cx, cy, SIDE_TOP))
               printf("XXX");
          else
               printf("...");
     }

     printf("\n");
}


void print_board_vrow(struct board_t *board, int cy)
{
     int sx = board->sx;

     for(int cx = 0; cx <= sx; cx++) {
          if (get_match_stick(board, cx, cy, SIDE_LEFT))
               printf("X");
          else
               printf(".");

          printf("   ");
     }

     printf("\n");
}

void print_board(struct board_t *board)
{
     int sy = board->sy;

     for(int cy = 0; cy <= sy; cy++) {
          print_board_hrow(board, cy);

          if (cy != sy) {
               print_board_vrow(board, cy);
               print_board_vrow(board, cy);
               print_board_vrow(board, cy);
          }
     }
}


int main(int argc, char *argv[]) {
     struct board_t board;

     init_board(4, 4, &board);

     /*
     set_match_stick(&board, 0, 1, SIDE_LEFT, true);
     set_match_stick(&board, 1, 1, SIDE_LEFT, true);
     set_match_stick(&board, 0, 1, SIDE_TOP , true);
     set_match_stick(&board, 0, 2, SIDE_TOP , true);
     set_match_stick(&board, 1, 2, SIDE_TOP , true);
     set_match_stick(&board, 2, 2, SIDE_TOP , true);
     set_match_stick(&board, 1, 0, SIDE_LEFT, true);
     set_match_stick(&board, 1, 0, SIDE_TOP , true);
     set_match_stick(&board, 2, 0, SIDE_TOP , true);
     set_match_stick(&board, 2, 1, SIDE_TOP , true);
     */

     set_match_stick(&board, 0, 0, SIDE_LEFT, true);
     set_match_stick(&board, 0, 1, SIDE_LEFT, true);
     set_match_stick(&board, 0, 2, SIDE_LEFT, true);
     set_match_stick(&board, 0, 3, SIDE_TOP, true);
     set_match_stick(&board, 1, 3, SIDE_TOP, true);
     set_match_stick(&board, 2, 3, SIDE_TOP, true);
     set_match_stick(&board, 1, 0, SIDE_LEFT, true);
     set_match_stick(&board, 1, 1, SIDE_LEFT, true);
     set_match_stick(&board, 1, 2, SIDE_TOP, true);
     set_match_stick(&board, 2, 1, SIDE_LEFT, true);
     set_match_stick(&board, 3, 0, SIDE_LEFT, true);
     set_match_stick(&board, 3, 1, SIDE_LEFT, true);
     set_match_stick(&board, 3, 2, SIDE_LEFT, true);
     set_match_stick(&board, 1, 0, SIDE_TOP, true);
     set_match_stick(&board, 2, 0, SIDE_TOP, true);

     print_board(&board);

     search(&board, 3, 2);

     printf("end run.\n");
     return 0;
}
