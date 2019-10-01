export namespace PlayerSettings {
  /** readonly. use setStoragePrefix to modify
   * 
   * the storagePrefix is what the localStorage will be stored under
   * 
   * paired with suffix t have different player settings on the same device */
  export let storagePrefix: string = ''
  /** readonly. use setStorageSuffix to modify
   * 
   * the storageSuffix is what the localStorage will be stored under
   * 
   * paired with prefix to have different player settings on the same device */
  export let storageSuffix: string = 'hexMemSettings'
  /** readonly. use setBrightness to modify 
   * 
   * range: [0, 2]
   * 
   * default: 1
  */
  export let brightness: number = 1
  /** readonly. use setVolume to modify 
   * 
   * range: [0, 100]
   * 
   * default: 50
  */
  export let volume: number = 50
  /** readonly. use setMute to modify 
   * 
   * range: [true/false]
   * 
   * default: false
  */
  export let mute: boolean = false
  /** readonly. use setColor to modify 
   * 
   * range: any color string | [0x000, 0xfff]
   * 
   * default: 0xfff
  */
  export let color: string | number = 0xfff

  /** pass any number of settings to set them here
   * @param options - an object containing desired player settings
   * @param shouldSave - save these changes to localstorage?
  */
  export function set(options: {
    storagePrefix?: string,
    storageSuffix?: string,
    brightness?:number,
    volume?:number,
    mute?:boolean,
    color?:string|number
  }, shouldSave: boolean = true) {
    if (options.storagePrefix !== undefined) setStoragePrefix(options.storagePrefix, false)
    if (options.storageSuffix !== undefined) setStorageSuffix(options.storageSuffix, false)
    if (options.brightness !== undefined) setBrightness(options.brightness, false)
    if (options.brightness !== undefined) setBrightness(options.brightness, false)
    if (options.volume !== undefined) setVolume(options.volume, false)
    if (options.mute !== undefined) setMute(options.mute, false)
    if (options.color !== undefined) setColor(options.color, false)

    shouldSave && save()
  }
  /** storage prefix to be used when saving to localStorage */
  export function setStoragePrefix(val:string, shouldSave: boolean = true) {
    storagePrefix = val
    shouldSave && save()
  }
  /** storage suffix to be used when saving to localStorage */
  export function setStorageSuffix(val:string, shouldSave: boolean = true) {
    storageSuffix = val
    shouldSave && save()
  }
  /** set brightness, from 0 to 2 */
  export function setBrightness(val:number, shouldSave: boolean = true) {
    brightness = val
    shouldSave && save()
  }
  /** set volume, from 0 to 100 */
  export function setVolume(val:number, shouldSave: boolean = true) {
    volume = Math.max(0, Math.min(2, val))
    shouldSave && save()
  }
  /** set mute, true or false */
  export function setMute(val:boolean, shouldSave: boolean = true) {
    mute = val
    shouldSave && save()
  }
  /** set color, by name or hexcode (ex; 0xfff) */
  export function setColor(val:string|number, shouldSave: boolean = true) {
    color = val
    shouldSave && save()
  }

  /** saves the settings to localStorage
   * 
   * saved as (storagePrefix + storageSuffix)
   */
  export function save() {
    const settings = {brightness, volume, mute, color}

    localStorage.setItem(storagePrefix + storageSuffix, JSON.stringify(settings))
  }

  export function load() {
    const settingsJSON = localStorage.getItem(storagePrefix + storageSuffix)

    if (!settingsJSON) return

    const settings = JSON.parse(settingsJSON)

    brightness = settings.brightness
    volume = settings.volume
    mute = settings.mute
    color = settings.color
  }
}