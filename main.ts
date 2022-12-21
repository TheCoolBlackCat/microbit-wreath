function turnOn () {
    pins.digitalWritePin(DigitalPin.P2, 1)
    basic.showIcon(IconNames.Happy)
    basic.clearScreen()
}
function yesOrNo () {
    basic.showLeds(`
        . . . . .
        . . . . .
        # # . . .
        . . . . .
        . . . . .
        `)
    basic.showIcon(IconNames.Yes)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . #
        . . . . .
        . . . . .
        `)
    basic.showIcon(IconNames.No)
    basic.showLeds(`
        . . . . .
        . . . . .
        # # . . #
        . . . . .
        . . . . .
        `)
    while (!(input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B))) {
        basic.pause(100)
    }
    if (input.buttonIsPressed(Button.A)) {
        return true
    }
    return false
}
function normaliseHour (hour: number) {
    if (hour > 23) {
        return 0
    } else if (hour < 0) {
        return 23
    } else {
        return hour
    }
}
input.onButtonPressed(Button.A, function () {
    if (!(disableControls)) {
        turnOn()
        manualOn = true
    }
})
function changeHour (hour: number, name: string) {
    basic.showString("CHG " + name + "?")
    if (yesOrNo()) {
        helpShownCount = 0
        while (!(input.buttonIsPressed(Button.AB))) {
            basic.pause(100)
            basic.showNumber(hour)
            basic.pause(100)
            if (helpShownCount < 1) {
                upOrDownHelp()
                helpShownCount += 1
            }
            if (upOrDown()) {
                hour += 1
            } else {
                hour += -1
            }
            hour = normaliseHour(hour)
        }
    }
    basic.clearScreen()
    basic.showIcon(IconNames.SmallHeart)
    return hour
}
function upOrDownHelp () {
    basic.showLeds(`
        . . . . .
        . . . . .
        # # . . .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . # . .
        . # # # .
        # . # . #
        . . # . .
        . . # . .
        `)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . #
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
        `)
    basic.showLeds(`
        . . . . .
        . . . . .
        # # . . #
        . . . . .
        . . . . .
        `)
}
timeanddate.onMinuteChanged(function () {
    if (!(disableControls)) {
        timeanddate.numericTime(function (hour, minute, second, month, day, year) {
            if (hour >= onHour && hour < offHour) {
                turnOn()
            } else if (manualOn) {
                turnOn()
            } else {
                turnOff()
            }
        })
    }
})
input.onButtonPressed(Button.B, function () {
    if (!(disableControls)) {
        turnOff()
        manualOn = false
    }
})
function turnOff () {
    pins.digitalWritePin(DigitalPin.P2, 0)
    basic.showIcon(IconNames.Sad)
    basic.clearScreen()
}
function upOrDown () {
    basic.showLeds(`
        . . . . .
        . . . . .
        # # . . #
        . . . . .
        . . . . .
        `)
    while (!(input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B))) {
        basic.pause(100)
    }
    if (input.buttonIsPressed(Button.A)) {
        return true
    }
    return false
}
function doConfig () {
    disableControls = true
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HHMM24hr))
    timeanddate.numericTime(function (hour, minute, second, month, day, year) {
        timeanddate.set24HourTime(changeHour(hour, "NOW"), 0, 0)
    })
    onHour = changeHour(onHour, "ON")
    offHour = changeHour(offHour, "OFF")
    basic.showIcon(IconNames.Heart)
    disableControls = false
    basic.clearScreen()
}
let hour = 0
let helpShownCount = 0
let manualOn = false
let offHour = 0
let onHour = 0
let disableControls = false
disableControls = true
onHour = 16
offHour = 22
basic.showIcon(IconNames.SmallHeart)
basic.showIcon(IconNames.Heart)
disableControls = false
basic.clearScreen()
basic.forever(function () {
    if (!(disableControls) && input.buttonIsPressed(Button.AB)) {
        doConfig()
    }
    basic.pause(100)
})
