export class SsoConstants {
  public static AdminCookieKeyForJWT = 'admin_sso_jwt'

  public static CookieKeyForLocale = 'c-sso-locale'
  public static CookieKeyForRegion = 'c-sso-region'
  public static HeaderKeyForLocale = 'x-sso-locale'
  public static HeaderKeyForRegion = 'x-sso-region'
  public static CookieKeyForJWT = 'fangcha_sso_jwt'
  public static JWTExpireTime = 30 * 24 * 3600 * 1000 // 单位: 毫秒
  public static EmailExpireTime = 24 * 3600 * 1000 // 单位: 毫秒
  public static AuthCodeLength = 6
  public static AuthorizationCodeExpireTime = 5 * 60 // 单位: 秒
  public static JointBindExpireTime = 10 * 60 // 单位: 秒
  public static ImageCaptchaExpireTime = 60 // 单位: 秒

  public static CookieKeyForTrackId = 'c-fangcha-track'
  public static TrackExpireTime = 30 * 24 * 3600 * 1000 // 单位: 毫秒
}
