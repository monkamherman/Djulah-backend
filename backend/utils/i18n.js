const dictionaries = {
  fr: {
    // Messages généraux
    "server.error": "Erreur serveur interne",
    not_found: "Route non trouvée",
    success: "Opération réussie",
    too_many_requests: "Trop de requêtes. Réessaie plus tard.",

    // Health check
    "health.status": "OK",
    "health.service": "Djulah API",
    "health.message": "API Production - MongoDB + Cloudinary + Auth",

    // Registration
    "auth.register.missing_fields":
      "Email, mot de passe et nom d'utilisateur requis.",
    "auth.register.name_required": "Le nom est requis.",
    "auth.register.success_check_email":
      "Inscription réussie. Vérifie ton email pour le code de vérification.",
    "auth.register.email_failed":
      "Inscription réussie, mais l'envoi de l'email a échoué. Utilise 'Renvoyer le code'.",
    "auth.register.already_registered_login":
      "Compte déjà enregistré. Connecte-toi.",
    "auth.register.verification_pending":
      "Vérification en attente. Consulte ton email.",
    "auth.register.failed":
      "Impossible de finaliser l'inscription. Réessaie plus tard.",

    // Rate limiting
    "auth.rate_limit": "Trop de requêtes. Réessaie plus tard.",

    "auth.verify.missing_fields": "Email et code de vérification requis.",
    "auth.verify.invalid_or_expired": "Code invalide ou expiré.",
    "auth.verify.success": "Email vérifié avec succès.",
    "auth.verify.failed":
      "La vérification de l'email a échoué. Réessaie plus tard.",

    "auth.resend.email_required": "Email requis.",
    "auth.resend.user_not_found": "Aucun compte trouvé avec cet email.",
    "auth.resend.already_verified": "Email déjà vérifié. Connecte-toi.",
    "auth.resend.too_many_requests":
      "Trop de demandes. Patiente 1 minute avant de renvoyer un code.",
    "auth.resend.success": "Nouveau code envoyé. Vérifie ton email.",
    "auth.resend.failed": "Impossible de renvoyer le code. Réessaie plus tard.",

    "auth.login.missing_fields": "Email et mot de passe requis.",
    "auth.login.invalid_credentials": "Email ou mot de passe incorrect.",
    "auth.login.email_not_verified":
      "Email non vérifié. Vérifie d'abord ton email.",
    "auth.login.success": "Connexion réussie.",
    "auth.login.failed": "La connexion a échoué. Réessaie plus tard.",

    "auth.forgot.email_required": "Email requis.",
    "auth.forgot.account_not_found": "Aucun compte trouvé avec cet email.",
    "auth.forgot.email_not_verified":
      "Email non vérifié. Vérifie d'abord ton email.",
    "auth.forgot.success":
      "Un code de réinitialisation a été envoyé à ton email.",
    "auth.forgot.failed":
      "Impossible de traiter la demande. Réessaie plus tard.",

    "auth.reset.missing_fields": "Email, code et nouveau mot de passe requis.",
    "auth.reset.password_too_short":
      "Le mot de passe doit contenir au moins 8 caractères.",
    "auth.reset.passwords_not_match": "Les mots de passe ne correspondent pas.",
    "auth.reset.invalid_or_expired":
      "Code de réinitialisation invalide ou expiré.",
    "auth.reset.success":
      "Mot de passe modifié avec succès. Tu peux te connecter.",
    "auth.reset.failed":
      "La réinitialisation du mot de passe a échoué. Réessaie plus tard.",

    "auth.profile.user_not_found": "Utilisateur introuvable.",
    "auth.profile.failed":
      "Impossible de récupérer le profil. Réessaie plus tard.",

    "auth.change_password.missing_fields":
      "Mot de passe actuel, nouveau mot de passe et confirmation requis.",
    "auth.change_password.too_short":
      "Le nouveau mot de passe doit contenir au moins 8 caractères.",
    "auth.change_password.not_match":
      "Le nouveau mot de passe et la confirmation ne correspondent pas.",
    "auth.change_password.current_incorrect":
      "Le mot de passe actuel est incorrect.",
    "auth.change_password.same_as_old":
      "Le nouveau mot de passe doit être différent de l'ancien.",
    "auth.change_password.success":
      "Mot de passe modifié. Reconnecte-toi avec ton nouveau mot de passe.",
    "auth.change_password.failed":
      "Impossible de modifier le mot de passe. Réessaie plus tard.",
  },
  en: {
    // General messages
    "server.error": "Internal server error",
    not_found: "Route not found",
    success: "Operation successful",
    too_many_requests: "Too many requests. Try again later.",

    // Health check
    "health.status": "OK",
    "health.service": "Djulah API",
    "health.message": "API Production - MongoDB + Cloudinary + Auth",

    // Registration
    "auth.register.missing_fields":
      "Email, password and username are required.",
    "auth.register.name_required": "Name is required.",
    "auth.register.success_check_email":
      "Registration successful. Check your email for the verification code.",
    "auth.register.email_failed":
      "Registration successful, but email sending failed. Please use resend code.",
    "auth.register.already_registered_login":
      "Account already registered. Please login.",
    "auth.register.verification_pending":
      "Verification pending. Check your email.",
    "auth.register.failed": "Registration failed. Please try again later.",

    // Rate limiting
    "auth.rate_limit": "Too many requests. Try again later.",

    "auth.verify.missing_fields": "Email and verification code are required.",
    "auth.verify.invalid_or_expired": "Invalid or expired verification code.",
    "auth.verify.success": "Email verified successfully.",
    "auth.verify.failed": "Email verification failed. Please try again later.",

    "auth.resend.email_required": "Email is required.",
    "auth.resend.user_not_found": "No account found with this email.",
    "auth.resend.already_verified": "Email already verified. Please login.",
    "auth.resend.too_many_requests":
      "Too many requests. Please wait 1 minute before requesting another code.",
    "auth.resend.success": "New code sent. Please check your email.",
    "auth.resend.failed":
      "Failed to resend verification code. Please try again later.",

    "auth.login.missing_fields": "Email and password are required.",
    "auth.login.invalid_credentials": "Invalid email or password.",
    "auth.login.email_not_verified":
      "Email not verified. Please verify your email first.",
    "auth.login.success": "Login successful.",
    "auth.login.failed": "Login failed. Please try again later.",

    "auth.forgot.email_required": "Email is required.",
    "auth.forgot.account_not_found":
      "No account found with this email address.",
    "auth.forgot.email_not_verified":
      "Email not verified. Please verify your email first.",
    "auth.forgot.success": "Password reset code sent to your email.",
    "auth.forgot.failed":
      "Failed to process password reset request. Please try again later.",

    "auth.reset.missing_fields": "Email, code, and new password are required.",
    "auth.reset.password_too_short":
      "Password must be at least 8 characters long.",
    "auth.reset.passwords_not_match":
      "New password and confirm password do not match.",
    "auth.reset.invalid_or_expired": "Invalid or expired reset code.",
    "auth.reset.success":
      "Password reset successful. You can now login with your new password.",
    "auth.reset.failed": "Password reset failed. Please try again later.",

    "auth.profile.user_not_found": "User not found.",
    "auth.profile.failed":
      "Failed to retrieve profile. Please try again later.",

    "auth.change_password.missing_fields":
      "Current password, new password, and confirm password are required.",
    "auth.change_password.too_short":
      "New password must be at least 8 characters long.",
    "auth.change_password.not_match":
      "New password and confirm password do not match.",
    "auth.change_password.current_incorrect": "Current password is incorrect.",
    "auth.change_password.same_as_old":
      "New password must be different from your current password.",
    "auth.change_password.success":
      "Password changed successfully. Please login with your new password.",
    "auth.change_password.failed":
      "Failed to change password. Please try again later.",
  },
};

const normalizeLocale = (acceptLanguage) => {
  if (!acceptLanguage || typeof acceptLanguage !== "string") return "fr";
  const lower = acceptLanguage.toLowerCase();
  if (lower.startsWith("en")) return "en";
  if (lower.startsWith("fr")) return "fr";
  return "fr";
};

const interpolate = (template, params) => {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const v = params[k];
    return v === undefined || v === null ? "" : String(v);
  });
};

export const createTranslator = (acceptLanguage) => {
  const locale = normalizeLocale(acceptLanguage);

  return {
    locale,
    t: (key, params = undefined, fallback = undefined) => {
      const dict = dictionaries[locale] || dictionaries.fr;
      const template = dict[key] || fallback || key;
      return interpolate(template, params);
    },
  };
};
