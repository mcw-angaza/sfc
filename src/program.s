;----- Aliases/Labels ----------------------------------------------------------
; these are aliases for the Memory Mapped Registers we will use
INIDISP     = $2100     ; inital settings for screen
OBJSEL      = $2101     ; object size $ object data area designation
OAMADDL     = $2102     ; address for accessing OAM
OAMADDH     = $2103
OAMDATA     = $2104     ; data for OAM write
VMAINC      = $2115     ; VRAM address increment value designation
VMADDL      = $2116     ; address for VRAM read and write
VMADDH      = $2117
VMDATAL     = $2118     ; data for VRAM write
VMDATAH     = $2119     ; data for VRAM write
CGADD       = $2121     ; address for CGRAM read and write
CGDATA      = $2122     ; data for CGRAM write
TM          = $212c     ; main screen designation
NMITIMEN    = $4200     ; enable flaog for v-blank
RDNMI       = $4210     ; read the NMI flag status
;-------------------------------------------------------------------------------

;----- Assembler Directives ----------------------------------------------------
.p816                           ; tell the assembler this is 65816 code
;-------------------------------------------------------------------------------

;----- Includes ----------------------------------------------------------------
.segment "SPRITEDATA"
SpriteData: .incbin "../rom/sprite.rom"
ColorData:  .incbin "../rom/palette.rom"
;-------------------------------------------------------------------------------

.segment "CODE"

Init:
        sep     #$30    ; X,Y,A are 8 bit numbers
        lda     #$8F    ; screen off, full brightness
        sta     $2100   ; brightness + screen enable register
        stz     $2101   ; Sprite register (size + address in VRAM)
        stz     $2102   ; Sprite registers (address of sprite memory [OAM])
        stz     $2103   ;    ""                       ""
        stz     $2105   ; Mode 0, = Graphic mode register
        stz     $2106   ; noplanes, no mosaic, = Mosaic register
        stz     $2107   ; Plane 0 map VRAM location
        stz     $2108   ; Plane 1 map VRAM location
        stz     $2109   ; Plane 2 map VRAM location
        stz     $210A   ; Plane 3 map VRAM location
        stz     $210B   ; Plane 0+1 Tile data location
        stz     $210C   ; Plane 2+3 Tile data location
        stz     $210D   ; Plane 0 scroll x (first 8 bits)
        stz     $210D   ; Plane 0 scroll x (last 3 bits) #$0 - #$07ff
        lda     #$FF    ; The top pixel drawn on the screen isn't the top one in the tilemap, it's the one above that.
        sta     $210E   ; Plane 0 scroll y (first 8 bits)
        sta     $2110   ; Plane 1 scroll y (first 8 bits)
        sta     $2112   ; Plane 2 scroll y (first 8 bits)
        sta     $2114   ; Plane 3 scroll y (first 8 bits)
        lda     #$07    ; Since this could get quite annoying, it's better to edit the scrolling registers to fix this.
        sta     $210E   ; Plane 0 scroll y (last 3 bits) #$0 - #$07ff
        sta     $2110   ; Plane 1 scroll y (last 3 bits) #$0 - #$07ff
        sta     $2112   ; Plane 2 scroll y (last 3 bits) #$0 - #$07ff
        sta     $2114   ; Plane 3 scroll y (last 3 bits) #$0 - #$07ff
        stz     $210F   ; Plane 1 scroll x (first 8 bits)
        stz     $210F   ; Plane 1 scroll x (last 3 bits) #$0 - #$07ff
        stz     $2111   ; Plane 2 scroll x (first 8 bits)
        stz     $2111   ; Plane 2 scroll x (last 3 bits) #$0 - #$07ff
        stz     $2113   ; Plane 3 scroll x (first 8 bits)
        stz     $2113   ; Plane 3 scroll x (last 3 bits) #$0 - #$07ff
        lda     #$80    ; increase VRAM address after writing to $2119
        sta     $2115   ; VRAM address increment register
        stz     $2116   ; VRAM address low
        stz     $2117   ; VRAM address high
        stz     $211A   ; Initial Mode 7 setting register
        stz     $211B   ; Mode 7 matrix parameter A register (low)
        lda     #$01
        sta     $211B   ; Mode 7 matrix parameter A register (high)
        stz     $211C   ; Mode 7 matrix parameter B register (low)
        stz     $211C   ; Mode 7 matrix parameter B register (high)
        stz     $211D   ; Mode 7 matrix parameter C register (low)
        stz     $211D   ; Mode 7 matrix parameter C register (high)
        stz     $211E   ; Mode 7 matrix parameter D register (low)
        sta     $211E   ; Mode 7 matrix parameter D register (high)
        stz     $211F   ; Mode 7 center position X register (low)
        stz     $211F   ; Mode 7 center position X register (high)
        stz     $2120   ; Mode 7 center position Y register (low)
        stz     $2120   ; Mode 7 center position Y register (high)
        stz     $2121   ; Color number register ($0-ff)
        stz     $2123   ; BG1 & BG2 Window mask setting register
        stz     $2124   ; BG3 & BG4 Window mask setting register
        stz     $2125   ; OBJ & Color Window mask setting register
        stz     $2126   ; Window 1 left position register
        stz     $2127   ; Window 2 left position register
        stz     $2128   ; Window 3 left position register
        stz     $2129   ; Window 4 left position register
        stz     $212A   ; BG1, BG2, BG3, BG4 Window Logic register
        stz     $212B   ; OBJ, Color Window Logic Register (or,and,xor,xnor)
        sta     $212C   ; Main Screen designation (planes, sprites enable)
        stz     $212D   ; Sub Screen designation
        stz     $212E   ; Window mask for Main Screen
        stz     $212F   ; Window mask for Sub Screen
        lda     #$30
        sta     $2130   ; Color addition & screen addition init setting
        stz     $2131   ; Add/Sub sub designation for screen, sprite, color
        lda     #$E0
        sta     $2132   ; color data for addition/subtraction
        stz     $2133   ; Screen setting (interlace x,y/enable SFX data)
        stz     $4200   ; Enable V-blank, interrupt, Joypad register
        lda     #$FF
        sta     $4201   ; Programmable I/O port
        stz     $4202   ; Multiplicand A
        stz     $4203   ; Multiplier B
        stz     $4204   ; Multiplier C
        stz     $4205   ; Multiplicand C
        stz     $4206   ; Divisor B
        stz     $4207   ; Horizontal Count Timer
        stz     $4208   ; Horizontal Count Timer MSB (most significant bit)
        stz     $4209   ; Vertical Count Timer
        stz     $420A   ; Vertical Count Timer MSB
        stz     $420B   ; General DMA enable (bits 0-7)
        stz     $420C   ; Horizontal DMA (HDMA) enable (bits 0-7)
        stz     $420D   ; Access cycle designation (slow/fast rom)
        cli             ; Enable interrupts
        rts

;-------------------------------------------------------------------------------
;   This is the entry point of the demo
;-------------------------------------------------------------------------------
.proc   ResetHandler
        jsr Init
        sei                     ; disable interrupts
        clc                     ; clear the carry flag
        xce                     ; switch the 65816 to native (16-bit mode)
        rep #%00010000          ; set the X register to 16-bit
        lda #$8f                ; force v-blanking
        sta INIDISP
        stz NMITIMEN            ; disable NMI

        ; transfer VRAM data
        stz VMADDL              ; set the VRAM address to $0000
        stz VMADDH
        lda #$80
        sta VMAINC              ; increment VRAM address by 1 when writing to VMDATAH
        ldx #$00                ; set register X to zero, we will use X as a loop counter and offset
        lda #%10100000
        sta OBJSEL
VRAMLoop:
        lda SpriteData, X       ; get bitplane 0/2 byte from the sprite data
        sta VMDATAL             ; write the byte in A to VRAM
        inx                     ; increment counter/offset
        lda SpriteData, X       ; get bitplane 1/3 byte from the sprite data
        sta VMDATAH             ; write the byte in A to VRAM
        inx                     ; increment counter/offset
        cpx #4096               ; check whether we have written 1024 bytes to VRAM
        bcc VRAMLoop            ; if X is smaller than $80, continue the loop

        ; Set background color to white
        stz CGADD
        lda #%11111111
        sta $2122
        lda #%01111111
        sta $2122

        ; Transfer CGRAM sprite data
        lda #$80
        sta CGADD               ; set CGRAM address to $80
        ldx #$00                ; set X to zero, use it as loop counter and offset
CGRAMLoop:
        lda ColorData, X        ; get the color low byte
        sta CGDATA              ; store it in CGRAM
        inx                     ; increase counter/offset
        lda ColorData, X        ; get the color high byte
        sta CGDATA              ; store it in CGRAM
        inx                     ; increase counter/offset
        cpx #160                ; check whether 160 bytes were transfered
        bcc CGRAMLoop           ; if not, continue loop

        ; Set OAM address to table 1
        stz OAMADDL
        stz OAMADDH

        ; OAM for main sprite
        lda #96                 ; x
        sta OAMDATA
        lda #117                ; y
        sta OAMDATA
        lda #0                  ; name
        sta OAMDATA
        lda #%00000000          ; palette 0
        sta OAMDATA

        ; OAM for title sprite 1
        lda #35                 ; x
        sta OAMDATA
        lda #59                 ; y
        sta OAMDATA
        lda #12                 ; name
        sta OAMDATA
        lda #%00000100          ; palette 1
        sta OAMDATA

        ; OAM for title sprite 2
        lda #86                 ; x
        sta OAMDATA
        lda #59                 ; y
        sta OAMDATA
        lda #72                 ; name
        sta OAMDATA
        lda #%00000110          ; palette 2
        sta OAMDATA

        ; OAM for title sprite 3
        lda #138                ; x
        sta OAMDATA
        lda #59                 ; y
        sta OAMDATA
        lda #76                 ; name
        sta OAMDATA
        lda #%00001000          ; palette 4
        sta OAMDATA

        ; OAM for title sprite 4
        lda #189                ; x
        sta OAMDATA
        lda #59                 ; y
        sta OAMDATA
        lda #8                  ; name
        sta OAMDATA
        lda #%00000010          ; palette 3
        sta OAMDATA

        ; Set OAM address to table 2
        stz OAMADDL
        lda #%00000001
        sta OAMADDH

        ; Set main sprite size to 64x64
        lda #%00000010
        sta OAMDATA

        ; Position sprites 6-128 offscreen
        lda #%01010100
        sta OAMDATA
        lda #%01010101
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA
        sta OAMDATA

        ; Make objects visible
        lda #%00010000
        sta TM

        ; Release forced blanking, set screen to full brightness
        lda #%00001111
        sta INIDISP

        ; Enable NMI, turn on automatic joypad polling
        lda #$81
        sta NMITIMEN

        jmp GameLoop            ; all initialization is done
.endproc
;-------------------------------------------------------------------------------

;-------------------------------------------------------------------------------
;   After the ResetHandler will jump to here
;-------------------------------------------------------------------------------
; .smart ; keep track of registers widths
.proc   GameLoop
        wai                     ; wait for NMI / V-Blank

        ; here we would place all of the game logic
        ; and loop forever

        jmp GameLoop
.endproc
;-------------------------------------------------------------------------------

;-------------------------------------------------------------------------------
;   Will be called during V-Blank
;-------------------------------------------------------------------------------
.proc   NMIHandler
        lda RDNMI               ; read NMI status, acknowledge NMI

        ; this is where we would do graphics update

        rti
.endproc
;-------------------------------------------------------------------------------

;-------------------------------------------------------------------------------
;   Is not used in this program
;-------------------------------------------------------------------------------
.proc   IRQHandler
        ; code
        rti
.endproc
;-------------------------------------------------------------------------------

;-------------------------------------------------------------------------------
;   Interrupt and Reset vectors for the 65816 CPU
;-------------------------------------------------------------------------------
.segment "VECTOR"
; native mode   COP,        BRK,        ABT,
.addr           $0000,      $0000,      $0000
;               NMI,        RST,        IRQ
.addr           NMIHandler, $0000,      $0000

.word           $0000, $0000    ; four unused bytes

; emulation m.  COP,        BRK,        ABT,
.addr           $0000,      $0000,      $0000
;               NMI,        RST,        IRQ
.addr           $0000,      ResetHandler, $0000
