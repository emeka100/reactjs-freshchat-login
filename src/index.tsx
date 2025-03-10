import * as React from 'react'
import styles from './styles.module.css'

// need to declare window for typescript stop complaining about fcWidget
declare const window: any

type FreshchatInitProps = {
  token: string
  externalId?: string
  firstName?: string
  lastName?: string
  host?: string
  restoreId?: string
  email?: string
  phone?: string
  phoneCountryCode?: string
  config?: any
  open?: boolean
  tags?: [string]
  faqTags?: any
  locale?: string
}

export interface FreshchatStyles {
  backgroundColor: string
  color: string
}

export interface FreshChatProps extends Freshchat


Props {
  label?: string
  ic_styles?: FreshchatStyles
}

export function Freshchat({
  label,
  ic_styles,
  ...rest
}: FreshChatProps): JSX.Element | null {
  const [isWidgetOpen, setIsWidgetOpen] = React.useState(false)
  const [firstLoad, setFirstLoad] = React.useState(true)
  
  const UrlIcon =
    'https://firebasestorage.googleapis.com/v0/b/repfinder-450e2.appspot.com/o/chat.svg?alt=media&token=885c5d28-2165-4a24-a96c-c1b0c98fab3f'

  // Inject FreshChat script in the html
  // oficial doc: https://developers.freshchat.com/web-sdk/#intro
  const loadScript = () => {
    const id = 'freshchat-lib'

  if (!(document.getElementById(id) || window.fcWidget)) {
      console.log('no init chat so load script')
      const script = document.createElement('script')
      script.async = true
      script.type = 'text/javascript'
      script.src = 'https://wchat.freshchat.com/js/widget.js'
      script.id = id
      document.head.appendChild(script)
    }
  }

  // Init FreshChat with the data passed in
const init = () => {
  try {
    console.log('initialize new user')
    console.log(rest)
    if (label) {
      if (!rest.config) {
        rest.config = {
          headerProperty: {
            hideChatButton: true
          }
        }
      } else {
        rest.config = {
          ...rest.config,
          headerProperty: {
            hideChatButton: true
          }
        }
      }
    }

    if (!rest.host) {
      rest.host = 'https://wchat.freshchat.com'
    }

    console.log('here')

    window.fcWidget.user.get().then(function (result: any) {
      console.log(result)
      const userInfo = result.data;
      const loggedInUser = userInfo.identifier

      console.log("existing init user: " + loggedInUser)
      console.log("logged in user: " + rest.externalId)

      if ((loggedInUser !== rest.externalId) || (!loggedInUser && !rest.externalId && firstLoad)) {
        console.log('trigger refresh user')
        window.fcWidget.destroy();

        window.fcWidget.init({
          ...rest
        })

        setFirstLoad(false)
      }
    }).catch(function (err: any) {

      window.fcWidget.init({
        ...rest
      })
      console.log(err)
    })
  
      console.log('there')
  }catch(err){
    console.log(err)
  }
  }


  const toggleWidget = () => {
    // hide button
    setIsWidgetOpen(true)

    if (window.fcWidget === undefined) return
    window.fcWidget.open()
    const script = document.createElement('script')
    script.async = true
    script.type = 'text/javascript'
    script.src = `${window.fcWidget.on('widget:closed', function () {
      // show button
      setIsWidgetOpen(false)
    })}`
    document.head.appendChild(script)

    const script_event = document.createElement('script')
    script_event.async = true
    script_event.type = 'text/javascript'
    script_event.src = `${window.fcWidget.on('user:created', function () {
      console.log('User has been created')
      // Function to do some task
    })}`
    document.head.appendChild(script_event)
  }

  React.useEffect(() => {
    loadScript()

    // need check if the FresChat was initalized before try to init the icon
    const interval = setInterval(() => {
      if (window.fcWidget) {
        clearInterval(interval)
        try {
          init()
        } catch (error) {
          console.log(error)
        }
      }
    }, 1000)
  })

  if (!label) {
    return null
  }

  return !isWidgetOpen ? (
    <div
      id='btn-widget'
      className={styles.buttonContainer}
      onClick={() => toggleWidget()}
    >
      <div
        className={styles.buttonContent}
        style={{
          backgroundColor: ic_styles ? ic_styles.backgroundColor : '#002d85',
          color: ic_styles ? ic_styles.color : '#ffffff',
          borderColor: ic_styles
            ? `transparent ${ic_styles.backgroundColor} transparent transparent`
            : `transparent #002d85 transparent transparent`
        }}
      >
        <div>{label}</div>
        <img src={UrlIcon} alt='chat icon' width='22px' height='22px' />
      </div>
    </div>
  ) : null
}
