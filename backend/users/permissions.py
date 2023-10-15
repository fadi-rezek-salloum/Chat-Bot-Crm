from rest_framework import permissions
from users.models import AccountStatus

class HasActiveSubscriptionOrTrial(permissions.BasePermission):
    message_trial_expired = "Your free trial has expired."
    message_subscription_expired = "Your subscription has expired."

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False
        try:
            account_status = user.account.accountstatus
        except AccountStatus.DoesNotExist:
            return False

        if account_status.is_trial_active and account_status.is_trial_expired():
            self.message = self.message_trial_expired
            return False
        if not account_status.is_trial_active and account_status.is_subscription_expired():
            self.message = self.message_subscription_expired
            return False
        
        return True