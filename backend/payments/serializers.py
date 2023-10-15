from rest_framework.serializers import ModelSerializer
from .models import Feature,Plan,Subscription,Payment
from rest_framework import serializers
class featureSerializer(ModelSerializer):
    class Meta:
        model=Feature
        fields='__all__'
    def create(self, validated_data):
        feature=Feature.objects.create(**validated_data)
        return feature
    def update(self, instance, validated_data):
        instance.name=validated_data.get('name',instance.name)
        instance.save()
        return instance
    
class planSerializer(ModelSerializer):
    features=featureSerializer(many=True)
    class Meta:
        model=Plan
        fields='__all__'
    def create(self, validated_data):
        features_data=validated_data.pop('features')
        plan=Plan.objects.create(**validated_data)
        for feature_data in features_data:
            feature,created=Feature.objects.get_or_create(**feature_data)
            plan.features.add(feature)
        return plan
    def update(self, instance, validated_data):
        updated_features=validated_data.pop('features')
        instance.name=validated_data.get('name',instance.name)
        instance.monthly_price=validated_data.get('monthly_price',instance.monthly_price)
        instance.quarterly_price=validated_data.get('quarterly_price',instance.quarterly_price)
        instance.yearly_price=validated_data.get('yearly_price',instance.yearly_price)
        #update features
        #delete all features
        instance.features.clear()
        for updated_feature in updated_features:
            feature,created=Feature.objects.get_or_create(**updated_feature)
            instance.features.add(feature)
        instance.save()
        return instance

class paymentSerializer(ModelSerializer):
    class Meta:
        model=Payment
        fields='__all__'

class subscriptionSerializer(ModelSerializer):
    payment=paymentSerializer()
    plan=planSerializer()
    class Meta:
        model=Subscription
        fields='__all__'

class MonthlyPaymentSerializer(serializers.Serializer):
    date = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

class MonthlyMessagesSerializer(serializers.Serializer):
    date = serializers.CharField()
    messages_count = serializers.DecimalField(max_digits=10, decimal_places=2)